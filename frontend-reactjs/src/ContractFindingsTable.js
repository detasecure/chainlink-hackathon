import React from 'react';
import { useTable, usePagination } from 'react-table';
import ImpactChart from './ImpactChart'; 

function ContractFindingsTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sl. No',
        accessor: 'id',
      },
      {
        Header: 'Impact',
        accessor: 'Impact',
      },
      {
        Header: 'Line Numbers',
        accessor: 'Line Numbers',
      },
      {
        Header: 'Finding Description',
        accessor: 'Finding Description',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable({ columns, data, initialState: { pageIndex: 0, pageSize: 20 } }, usePagination);

  return (
    <div style={{ padding: '0 5%' }}>
      <ImpactChart data={data} />
      <table {...getTableProps()} style={{ width: '100%', height: 400 }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{ color: row.values.Impact === 'High' ? 'red' : row.values.Impact === 'Medium' ? 'orange' : row.values.Impact === 'Low' ? 'yellow' : 'green' }}>
                {row.cells.map(cell => {
                //   return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>

                    // Check if the cell is the 'Finding Description' cell
                    if (cell.column.Header === 'Finding Description') {
                        // Remove the unwanted strings from the description
                        const cleanedDescription = cell.value.replace(/\(crytic-export\/etherscan-contracts\/.*?\)/g, '');
                        const blurEffect = ['High', 'Medium'].includes(row.original.Impact) ? { filter: 'blur(3px)' } : {};
                        return <td {...cell.getCellProps()} style={blurEffect}>{cleanedDescription}</td>
                    } else {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    }

                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </div>
  );
}

export default ContractFindingsTable;
