const API = '/api';

function valueOf(obj, ...keys) {
    for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return '';
}

function formatDate(value) {
    if (!value) return '';
    return String(value).replace('T', ' ').slice(0, 19);
}

async function api(url) {
    const response = await fetch(url);
    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const data = await response.json();
            message = data.error || message;
        } catch (_) {}
        throw new Error(message);
    }
    return response.json();
}

const params = new URLSearchParams(window.location.search);
const customerId = params.get('id');

async function loadCustomerPage() {
    if (!customerId) {
        document.body.insertAdjacentHTML('beforeend', '<p>Missing customer id.</p>');
        return;
    }

    try {
        const [customers, numbers, bills] = await Promise.all([
            api(`${API}/customers`),
            api(`${API}/customers/${encodeURIComponent(customerId)}/numbers`),
            api(`${API}/customers/${encodeURIComponent(customerId)}/bills`)
        ]);

        const customer = customers.find(c =>
            String(valueOf(c, 'Customer_ID', 'customer_id')) === String(customerId)
        );

        if (!customer) throw new Error('Customer not found');

        document.getElementById('customerId').textContent =
            valueOf(customer, 'Customer_ID', 'customer_id');
        document.getElementById('customerName').textContent =
            `${valueOf(customer, 'First_name', 'first_name')} ${valueOf(customer, 'Last_name', 'last_name')}`;
        document.getElementById('customerEmail').textContent =
            valueOf(customer, 'Email', 'email');
        document.getElementById('customerStatus').textContent =
            valueOf(customer, 'Status', 'status');

        const mobileTable = document.getElementById('mobileTable');
        mobileTable.innerHTML = '';

        numbers.forEach(number => {
            const phone = valueOf(number, 'Phone_Number', 'phone_number');
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${phone}</td>
                <td>${formatDate(valueOf(number, 'Activation_date', 'activation_date'))}</td>
                <td>${valueOf(number, 'Status', 'status')}</td>
                <td>
                    <a href="mobile.html?phone=${encodeURIComponent(phone)}">View</a>
                </td>
            `;

            mobileTable.appendChild(row);
        });

        if (!numbers.length) {
            mobileTable.innerHTML = '<tr><td colspan="4">No mobile numbers</td></tr>';
        }

        const billTable = document.getElementById('billTable');
        billTable.innerHTML = '';

        bills.forEach(bill => {
            const billId = valueOf(bill, 'Bill_ID', 'bill_id');
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${billId}</td>
                <td>${formatDate(valueOf(bill, 'Billing_period', 'billing_period'))}</td>
                <td>${valueOf(bill, 'Total_amount', 'total_amount', 'Total_Amount')}</td>
                <td>${valueOf(bill, 'Status', 'status')}</td>
                <td>
                    <a href="bill.html?id=${encodeURIComponent(billId)}">View Bill</a>
                </td>
            `;

            billTable.appendChild(row);
        });

        if (!bills.length) {
            billTable.innerHTML = '<tr><td colspan="5">No bills</td></tr>';
        }
    } catch (error) {
        alert(`Cannot load customer: ${error.message}`);
    }
}

loadCustomerPage();
