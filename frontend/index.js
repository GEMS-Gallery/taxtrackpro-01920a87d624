import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const taxpayerForm = document.getElementById('taxpayer-form');
  const updateTaxpayerForm = document.getElementById('update-taxpayer-form');
  const searchForm = document.getElementById('search-form');
  const taxpayerTableBody = document.getElementById('taxpayer-table-body');
  const searchResult = document.getElementById('search-result');
  const openPopupBtn = document.getElementById('open-popup-btn');
  const closePopupBtn = document.getElementById('close-popup-btn');
  const closeUpdatePopupBtn = document.getElementById('close-update-popup-btn');
  const popupOverlay = document.getElementById('popup-overlay');
  const updatePopupOverlay = document.getElementById('update-popup-overlay');

  // Function to open popup
  openPopupBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'block';
  });

  // Function to close popup
  closePopupBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  // Function to close update popup
  closeUpdatePopupBtn.addEventListener('click', () => {
    updatePopupOverlay.style.display = 'none';
  });

  // Close popups when clicking outside
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  });

  updatePopupOverlay.addEventListener('click', (e) => {
    if (e.target === updatePopupOverlay) {
      updatePopupOverlay.style.display = 'none';
    }
  });

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
    popupOverlay.style.display = 'none';
    await updateTaxpayerList();
  });

  // Function to update a taxpayer
  updateTaxpayerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taxpayer = {
      tid: document.getElementById('update-tid').value,
      firstName: document.getElementById('update-firstName').value,
      lastName: document.getElementById('update-lastName').value,
      address: document.getElementById('update-address').value,
      taxBracketCode: document.getElementById('update-taxBracketCode').value,
    };

    const success = await backend.updateTaxPayer(taxpayer);
    if (success) {
      updateTaxpayerForm.reset();
      updatePopupOverlay.style.display = 'none';
      await updateTaxpayerList();
    } else {
      alert('Failed to update taxpayer. Please try again.');
    }
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
        <td>
          <button class="update-btn" data-tid="${taxpayer.tid}">Update</button>
          <button class="delete-btn" data-tid="${taxpayer.tid}">Delete</button>
        </td>
      `;
      taxpayerTableBody.appendChild(row);
    });

    // Add event listeners for update and delete buttons
    document.querySelectorAll('.update-btn').forEach(btn => {
      btn.addEventListener('click', (e) => openUpdatePopup(e.target.dataset.tid));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => deleteTaxpayer(e.target.dataset.tid));
    });
  }

  // Function to open update popup
  async function openUpdatePopup(tid) {
    const taxpayer = await backend.searchTaxPayer(tid);
    if (taxpayer.length > 0) {
      const tp = taxpayer[0];
      document.getElementById('update-tid').value = tp.tid;
      document.getElementById('update-firstName').value = tp.firstName;
      document.getElementById('update-lastName').value = tp.lastName;
      document.getElementById('update-address').value = tp.address;
      document.getElementById('update-taxBracketCode').value = tp.taxBracketCode;
      updatePopupOverlay.style.display = 'block';
    } else {
      alert('Taxpayer not found');
    }
  }

  // Function to delete a taxpayer
  async function deleteTaxpayer(tid) {
    if (confirm('Are you sure you want to delete this taxpayer?')) {
      const success = await backend.deleteTaxPayer(tid);
      if (success) {
        await updateTaxpayerList();
      } else {
        alert('Failed to delete taxpayer. Please try again.');
      }
    }
  }

  // Initial load of taxpayer list
  await updateTaxpayerList();
});
