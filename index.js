const encounterTable = document.getElementById('encountertable');
const encounterBody = document.getElementById('encounterbody');
const addCombatantButton = document.getElementById('addCombatantButton');
const modal = document.getElementById('myModal');
const characterForm = document.getElementById('characterForm')
const modalSubmitButton = document.getElementById('modalSubmit');
const modalCancelButton = document.getElementById('modalCancel');
const saveCombatantsButton = document.getElementById('saveCombatants');
const loadPartyButton = document.getElementById('loadPartyButton');
const sortByInitButton = document.getElementById('sortByInit');

// Chimera's Bane!
const playerCharacters = [
    {
        "name": "Monde",
        "type": "Player",
        "hitpoints": 33
    },
    {
        "name": "Bilwin",
        "type": "Player",
        "hitpoints": 43
    },
    {
        "name": "Grindlefoot",
        "type": "Player",
        "hitpoints": 28
    },
    {
        "name": "Dolor",
        "type": "Player",
        "hitpoints": 37
    },
    {
        "name": "Gven",
        "type": "Player",
        "hitpoints": 55
    }
];

class Combatant {
    constructor(name, type, hitpoints) {
        this.name = name;
        this.type = type;
        this.hitpoints = hitpoints;
        this.currenthitpoints = hitpoints;
        this.init = 0;
    }
}

const validateName = (input, min) => {
    const nameLength = input.value.trim().length;

    if (nameLength >= min) {
        input.parentElement.classList.remove('invalid');
        return true;
    } else {
        input.parentElement.classList.add('invalid');
        return false;
    }
}

const validateHitPoints = (input, max) => {
    const hitpoints = parseInt(input.value, 10); // Convert the value to an integer

    if (hitpoints < max) {
        input.parentElement.classList.remove('invalid');
        return true;
    } else {
        input.parentElement.classList.add('invalid');
        return false;
    }
}

addCombatantButton.addEventListener('click', () => {
    modal.style.display = 'block';
});


characterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const typeInput = document.getElementById('type');
    const hitpointsInput = document.getElementById('hitpoints');

    const name = nameInput.value;
    const type = typeInput.value;
    const hitpoints = hitpointsInput.value;

    if (validateName(nameInput, 3) && validateHitPoints(hitpointsInput, 500)) {
        const addedCombatant = new Combatant(name, type, hitpoints);

        addCombatantToEncounter(addedCombatant);
    
        // Reset the form
        characterForm.reset();
    
        // Close the modal after submission
        modal.style.display = 'none';
    } else {
        alert('Please fill out the form correctly.');
    }
});

modalCancelButton.addEventListener('click', () => {
    clearModal();
})

// Set a visual cue that you're dragging something.
encounterTable.addEventListener('dragstart', function (e) {
    const draggedElement = e.target.closest('tr');
    draggedElement.classList.toggle('dragging');
    e.dataTransfer.setData('text/plain', draggedElement.outerHTML);
    e.target.style.opacity = '0.5';
});

encounterTable.addEventListener('dragover', function (e) {
    e.preventDefault();
    const draggedElement = document.querySelector('.dragging');
    const targetElement = e.target;

    if (targetElement.tagName === 'TR' && draggedElement !== targetElement) {

        const rect = targetElement.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (e.clientY < midY) {
            targetElement.parentNode.insertBefore(draggedElement, targetElement);
        } else {
            targetElement.parentNode.insertBefore(draggedElement, targetElement.nextElementSibling);
        }
    }
});

encounterTable.addEventListener('drop', function (e) {
    e.preventDefault();

    const data = e.dataTransfer.getData('text/plain');
    const draggedElement = document.querySelector('.dragging');

    // Check if the dataTransfer contains data (external source)
    if (data && draggedElement) {
        const newItem = createDraggableItem(data);

        // Find the target element
        const targetElement = e.target.closest('tr');
        targetElement.setAttribute("draggable", true);

        // Insert the new item at the correct position
        if (targetElement) {
            targetElement.parentNode.insertBefore(newItem, targetElement);
        } else {
            encounterTable.appendChild(newItem);
        }

        // Remove the original dragged element
        draggedElement.remove();
    }
});


encounterTable.addEventListener('click', function(e) {
    if (e.target) {
        const rows = document.querySelectorAll('#encounterbody tr');

        rows.forEach(row => {
            if (row === e.target.closest('tr')) {
                row.classList.toggle(`selected`);
            } else if (row.classList.contains(`selected`)) {
                row.classList.toggle(`selected`);
            }
        })
    }
  });

  loadPartyButton.addEventListener("click", async () => {
    // Loop through the player characters and add them to the encounter table
    playerCharacters.forEach((player) => {
        const addedCombatant = new Combatant(
            player.name,
            player.type,
            player.hitpoints
        );
        addCombatantToEncounter(addedCombatant);
    });
});


function createDraggableItem(info) {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = info;
    tableRow.setAttribute('draggable', 'true'); // Make the entire row draggable
    return tableRow;
}

function combatantHandler(event) {
    const target = event.target;

    // Check if the clicked element is an "Edit" button
    if (target.tagName === 'BUTTON' && target.id.endsWith('-edit-button')) {
        const characterName = target.id.split('-')[0];
        const name = document.getElementById(`${characterName}-name`);
        const init = document.getElementById(`${characterName}-init`);
        const type = document.getElementById(`${characterName}-type`);
        const currenthp = document.getElementById(`${characterName}-currenthp`);
        const totalhp = document.getElementById(`${characterName}-totalhp`);

        const inputs = [
            name,
            init,
            type,
            currenthp,
            totalhp
        ];

        const fields = [
            name.nextElementSibling,
            init.nextElementSibling,
            type.nextElementSibling,
            currenthp.nextElementSibling,
            totalhp.nextElementSibling
        ];

        // Toggle visibility of inputs and fields
        inputs.forEach((input, index) => {
            const key = input.id;
            const value = input.value;

            // Update the corresponding field with the current input value when in 'Save' mode
            if (target.innerHTML === 'Save') {
                fields[index].innerText = value;
            }

            input.classList.toggle("hidden");
        });

        fields.forEach((field) => {
            field.classList.toggle("hidden");
        });

        // Toggle button text
        target.innerHTML = (target.innerHTML === 'Edit') ? 'Save' : 'Edit';
    }
}

encounterTable.addEventListener('click', combatantHandler);



function addCombatantToEncounter(combatant) {
    combatantTableRow = document.createElement('tr');
    combatantTableRow.setAttribute('id', combatant.name);
    combatantTableRow.setAttribute('draggable', 'true'); // Make the entire row draggable

    combatantTableRow.innerHTML = `
        <form class="combatant-form" id='${combatant.name}-form'>
        <td class="name">
            <input class="input name hidden" id='${combatant.name}-name' type='text' value='${combatant.name}'>
            <div class="field name">${combatant.name}</div>
        </td>
        <td class="init">
            <input class="input init hidden" id='${combatant.name}-init' type='text' value='${combatant.init}'>
            <div class="field init">0</div>
        </td>
        <td class="type">
            <input class="input type hidden" id='${combatant.name}-type' type='text' value='${combatant.type}'>
            <div class="field type">${combatant.type}</div>
        </td>
        <td class="currenthp">
            <input class="input currenthp hidden" id='${combatant.name}-currenthp' type='number' value='${combatant.hitpoints}'>
            <div class="field currenthp">${combatant.hitpoints}</div>
        </td>
        <td class="totalhp">
            <input class="input totalhp hidden" id='${combatant.name}-totalhp' type='number' value='${combatant.hitpoints}'>
            <div class="field totalhp">${combatant.hitpoints}</div>
        </td>
        <td>
        <button type="button" id='${combatant.name}-edit-button'>Edit</button>
        </td>
        </form>`;

    encounterBody.appendChild(combatantTableRow);
}

function sortRowsByInitiative() {
    const rows = document.querySelectorAll('#encounterbody tr');
    const sortedRows = Array.from(rows)
    .sort((a, b) => {
        const aInitiativeElem = a.querySelector('.init').querySelector('.field');
        const bInitiativeElem = b.querySelector('.init').querySelector('.field');
        const aInitiative = parseInt(aInitiativeElem ? aInitiativeElem.innerText : 0, 10);
        const bInitiative = parseInt(bInitiativeElem ? bInitiativeElem.innerText : 0, 10);
        return bInitiative - aInitiative;
    });
    // Clear and reappend the sorted rows
    const tableBody = document.getElementById('encounterbody');
    tableBody.innerHTML = '';
    sortedRows.forEach(row => tableBody.appendChild(row));
}

sortByInitButton.addEventListener('click', sortRowsByInitiative);


function clearModal() {
    const nameInput = document.getElementById('name');
    const typeInput = document.getElementById('type');
    const hitpointsInput = document.getElementById('hitpoints');

    // Reset the input values
    nameInput.value = '';
    typeInput.value = '';
    hitpointsInput.value = '';

    // Close the modal after submission
    modal.style.display = 'none';
}

// const rows = document.querySelectorAll('#encounterbody tr');

// rows.forEach(row => {
//     row.addEventListener('click', () => {
//         // Toggle 'selected' class on the clicked row
//         row.classList.toggle('selected');
        
//         // Remove 'selected' class from all other rows
//         rows.forEach(r => {
//             if (r !== row) {
//                 r.classList.remove('selected');
//             }
//         });
//     });
// });