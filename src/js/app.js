var friendsList = ['Ayush', 'Atrey', 'Suraj'];

function addExpense() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('addExpenseDiv').style.display = 'block';
    var select = document.getElementById('participantList');
    friendsList.forEach(function (friend) {
        var label = document.createElement('label');
        label.appendChild(document.createTextNode(friend));
        var option = document.createElement('option');
        option.appendChild(label);
        select.appendChild(option);
    });
    var select2 = document.getElementById('paidBy');
    friendsList.forEach(function (friend) {
        var label = document.createElement('label');
        label.appendChild(document.createTextNode(friend));
        var option = document.createElement('option');
        option.appendChild(label);
        select2.appendChild(option);
    });
};

function storeExpense() {
    if (document.addExpenseForm.checkValidity()) {
        var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        var description = document.getElementById('expenseDescription').value;
        var payee = document.getElementById('paidBy').value;
        var amount = document.getElementById('expenseAmount').value;
        var participants = Array.from(document.getElementById('participantList').options).filter(function (option) {
            return option.selected;
        }).map(function (option) {
            return option.innerText;
        });
        var perHeadShare = amount / participants.length;
        var ownedData = participants.reduce(function (res, ownedBy) {
            res.push({
                'ownedTo': payee,
                'ownedBy': ownedBy,
                'amount': perHeadShare
            });
            return res;
        }, []);
        expenses.push({
            'description': description,
            'amount': amount,
            'payee': payee,
            'participants': participants,
            'ownedData': ownedData
        });
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }
};
function displayDueAmountList() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('dueAmountDiv').style.display = 'block';
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    var tbody = document.getElementById('dueAmountTable');
    if (!expenses.length) {
        document.getElementById('noDueAmount').style.display = 'block';
        document.getElementById('noDueTable').style.display = 'none';
    } else {
        document.getElementById('noDueAmount').style.display = 'none';
        document.getElementById('noDueTable').style.display = 'inline-table';
        expenses.forEach(function (expense) {
            expense.ownedData.forEach(function (ownedData) {
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                td.innerText = ownedData.ownedBy;
                tr.appendChild(td);
                var td = document.createElement('td');
                td.innerText = ownedData.ownedTo;
                tr.appendChild(td);
                var td = document.createElement('td');
                td.innerText = ownedData.amount;
                tr.appendChild(td);
                tbody.appendChild(tr);
            });
        });
    }
};

function displayExpenseList() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('expenselist').style.display = 'block';
    var expenseTable = document.getElementById('expenseListTable');
    var expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    var tbody = document.createElement('tbody');
    if (!expenses.length) {
        document.getElementById('noExpense').style.display = 'block';
        document.getElementById('expenseTable').style.display = 'none';
    } else {
        document.getElementById('noExpense').style.display = 'none';
        document.getElementById('expenseTable').style.display = 'inline-table';
        expenses.forEach(function (expense, i) {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.innerText = expense.description;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerText = expense.amount;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerText = expense.payee;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerText = expense.participants;
            tr.appendChild(td);
            tr.setAttribute('indexExpense', i);
            tbody.appendChild(tr);
        });
        expenseTable.appendChild(tbody);
        Array.from(document.getElementById('expenseListTable').children[0].children).forEach(function (tr) {
            tr.addEventListener('click', function (event) {
                if (event.offsetX > this.offsetWidth - 48) {
                    expenses.splice(this.attributes.indexexpense.value, 1);
                    localStorage.setItem('expenses',JSON.stringify(expenses));
                    displayExpenseList();
                }
            });
        });
    }
};

function showHomePage() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('expenselist').style.display = 'none';
    document.getElementById('dueAmountDiv').style.display = 'none';
    document.getElementById('expenseListTable').innerHTML = "";
};