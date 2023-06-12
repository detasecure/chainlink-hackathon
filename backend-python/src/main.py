import json
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import File
import uvicorn
import os
from zipfile import ZipFile
import tempfile
import datetime

from util import Util, BlockchainCategory, PolygonNetworkType, EthereumNetworkType

from src.scanner_on_chain_contracts import ScannerOnChain
from src.db_handler import DBHandler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

db_handler = DBHandler()

util = Util()


@app.get("/api/get_risk_score_polygon_mainnet_verified_contract")
async def get_risk_score_polygon_mainnet_verified_contract(smart_contract_address:str):
    chain_category: int = 1
    network_id: int = 11
    response = do_scan_onchain(chain_category, smart_contract_address, network_id)
    return response

def do_scan_onchain(chain_category:int, smart_contract_address:str, network_id:int=11):
    try:
        response = {}

        if chain_category == BlockchainCategory.POLY:
            response["blockchain_category"] = BlockchainCategory.POLY.name
            response["contract_address"] = smart_contract_address

            network_id = 11

            if network_id == PolygonNetworkType.MAINNET:
                response["network_id"]=PolygonNetworkType.MAINNET.name
            elif network_id == PolygonNetworkType.TESTNET:
                response["network_id"] = PolygonNetworkType.TESTNET.name
            else:
                response["ERROR"] = "Invalid TESTNET /  MAINNET selection"

            smart_contract_analyzer = SmartContractAnalyzer()

            contract_adddress_hash = smart_contract_analyzer.generate_contract_hash(
                contract_address=response["contract_address"],
                blockchain_name=response["blockchain_category"],
                network_type=response["network_id"])

            db_data = db_handler.get_findings_from_db(contract_adddress_hash=contract_adddress_hash)

            if db_data is not None and "ERROR" not in db_data:
                if ("scan_result" in db_data):
                    del db_data["scan_result"]

                return db_data


            is_valid, is_verified = util.is_valid_verified_contract(smart_contract_address)
            if is_valid and is_verified:
                slither_runner_on_chain = SlitherRunnerOnChain()
                findings_json_filename = slither_runner_on_chain.run_slither_onchain_scanner(smart_contract_address)
                # findings_json_filename = "./smart_contracts/output_poly:0x2e67a72db74A7EbF0Bc70F6a3b4Fc2aCFbB3c010.json"
                if (findings_json_filename and len(findings_json_filename.strip()) > 0):
                    with open(findings_json_filename, 'r') as f:
                        parsed_result = json.load(f)
                        normalized_score = util.calculate_risk_score(parsed_result)
                        response["risk_score"] = normalized_score
                        response["scan_result"] = parsed_result
                else:
                    response["ERROR"] = "Somthing went wrong. Data can't be saved. No file found."
            else:
                response["ERROR"] = "Invalid smart contract address. Please specify a valid & verified Polygon Mainnet smart contract address. See this - https://polygonscan.com/contractsVerified"

          else:
            response["ERROR"] = "Supports ONLY POLYGON MAINNET for now."

        if db_data is None or "ERROR" not in response:
            db_handler.save_findings_to_db(contract_adddress_hash=contract_adddress_hash,
                                                         json_output= response)
        if ("scan_result" in response):
            del response["scan_result"]
        return response

    except Exception as e:
        print("###############",e)
        return {"message": f"Error Occurred. {e}"}

@app.get("/api/get_stat_for_user_contracts")
async def get_stat():
    db_data = db_handler.get_all_findings_from_db()
    response = []
    if db_data is not None and "ERROR" not in db_data:
        for contact_data in db_data:
            if ("scan_result" in contact_data):
                del contact_data["scan_result"]
            response.append(contact_data)
    return response

@app.get("/api/get_all_contract_stats_summary")
async def get_all_contract_stats_summary():
    db_data_polygon = db_handler.get_all_polygon_contract_summary_from_db()
    db_data_ethereum = db_handler.get_all_ethereum_contract_summary_from_db()
    db_data_all = {
        'polygon_contacts_count': len(db_data_polygon),
        'ethereum_contacts_count': len(db_data_ethereum),
        'polygon_contacts': db_data_polygon,
        'ethereum_contacts': db_data_ethereum,
    }
    return db_data_all



if __name__ == "__main__":
    host = os.getenv("HOST")
    port = 8080
    uvicorn.run(app, host=host, port=port)
