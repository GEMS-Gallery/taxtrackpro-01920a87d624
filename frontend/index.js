import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const taxpayerForm = document.getElementById('taxpayer-form');
  const searchForm = document.getElementById('search-form');
  const taxpayerTableBody = document.getElementById('taxpayer-table-body');
  const searchResult = document.getElementById('search-result');

  // Function to add a new taxpayer
  taxpayerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taxpayer = {
      tid: document.getElementById('tid').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      taxBracketCode: document.getElementById('taxBracketCode').value,
    };

    await backend.addTaxPayer(taxpayer);
    taxpayerForm.reset();
    await updateTaxpayerList();
  });

  // Function to search for a taxpayer
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tid = document.getElementById('search-tid').value;
    const result = await backend.searchTaxPayer(tid);
    
    if (result.length > 0) {
      const taxpayer = result[0];
      searchResult.innerHTML = `
        <h3>Search Result:</h3>
        <p>TID: ${taxpayer.tid}</p>
        <p>Name: ${taxpayer.firstName} ${taxpayer.lastName}</p>
        <p>Address: ${taxpayer.address}</p>
        <p>Tax Bracket: ${taxpayer.taxBracketCode}</p>
      `;
    } else {
      searchResult.innerHTML = '<p>No taxpayer found with the given TID.</p>';
    }
  });

  // Function to update the taxpayer list
  async function updateTaxpayerList() {
    const taxpayers = await backend.getAllTaxPayers();
    taxpayerTableBody.innerHTML = '';
    taxpayers.forEach((taxpayer) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${taxpayer.tid}</td>
        <td>${taxpayer.firstName}</td>
        <td>${taxpayer.lastName}</td>
        <td>${taxpayer.address}</td>
        <td>${taxpayer.taxBracketCode}</td>
      `;
      taxpayerTableBody.appendChild(row);
    });
  }

  // Initial load of taxpayer list
  await updateTaxpayerList();
});
