const API = '/api';

function valueOf(obj, ...keys) {
    for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return '';
}

async function api(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const data = await response.json();
            message = data.error || message;
        } catch (_) {}
        throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
}

async function loadCustomers() {
    const table = document.getElementById('customerTable');

    try {
        const customers = await api(`${API}/customers`);
        table.innerHTML = '';

        customers.forEach(customer => {
            const id = valueOf(customer, 'Customer_ID', 'customer_id');
            const firstName = valueOf(customer, 'First_name', 'first_name');
            const lastName = valueOf(customer, 'Last_name', 'last_name');
            const email = valueOf(customer, 'Email', 'email');
            const status = valueOf(customer, 'Status', 'status');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${id}</td>
                <td>${firstName} ${lastName}</td>
                <td>${email}</td>
                <td>${status}</td>
                <td>
                    <a href="customer.html?id=${encodeURIComponent(id)}">View</a>
                    <button type="button" class="editCustomer">Edit</button>
                    <button type="button" class="deleteCustomer">Delete</button>
                </td>
            `;

            row.querySelector('.editCustomer').addEventListener('click', async () => {
                const newFirst = prompt('First name:', firstName);
                if (newFirst === null) return;

                const newLast = prompt('Last name:', lastName);
                if (newLast === null) return;

                const newEmail = prompt('Email:', email);
                if (newEmail === null) return;

                const newStatus = prompt('Status (Active/Inactive):', status);
                if (newStatus === null) return;

                try {
                    await api(`${API}/customers/${encodeURIComponent(id)}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            First_name: newFirst,
                            Last_name: newLast,
                            Email: newEmail,
                            Status: newStatus
                        })
                    });
                    await loadCustomers();
                } catch (error) {
                    alert(`Update failed: ${error.message}`);
                }
            });

            row.querySelector('.deleteCustomer').addEventListener('click', async () => {
                if (!confirm(`Delete customer ${id}?`)) return;

                try {
                    await api(`${API}/customers/${encodeURIComponent(id)}`, {
                        method: 'DELETE'
                    });
                    await loadCustomers();
                } catch (error) {
                    alert(
                        `Delete failed: ${error.message}\n` +
                        `The customer may still be referenced by mobile numbers or bills.`
                    );
                }
            });

            table.appendChild(row);
        });
    } catch (error) {
        table.innerHTML = `<tr><td colspan="5">Cannot load customers: ${error.message}</td></tr>`;
    }
}

document.getElementById('customerForm').addEventListener('submit', async event => {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const status = document.getElementById('customerStatus').value;

    if (!firstName || !lastName || !email) {
        alert('Please fill in first name, last name and email.');
        return;
    }

    try {
        await api(`${API}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                First_name: firstName,
                Last_name: lastName,
                Email: email,
                Status: status
            })
        });

        event.target.reset();
        await loadCustomers();
    } catch (error) {
        alert(`Add customer failed: ${error.message}`);
    }
});

loadCustomers();
