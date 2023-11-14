const encounterTable = document.getElementById('encountertable');
const encounterBody = document.getElementById('encounterbody');
const addCombatantButton = document.getElementById('addCombatantButton');
const modal = document.getElementById('myModal');
const modalSubmitButton = document.getElementById('modalSubmit');
const modalCancelButton = document.getElementById('modalCancel');
const editCombatantsButton = document.getElementById('editCombatants');
const saveCombatantsButton = document.getElementById('saveCombatants')


class Combatant {
    constructor(name, type, hitpoints) {
        this.name = name;
        this.type = type;
        this.hitpoints = hitpoints;
    }
}

addCombatantButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

editCombatantsButton.addEventListener('click', () => {
    const inputs = document.querySelectorAll('.input');
    const fields = document.querySelectorAll('.field');

    // Toggle visibility of inputs and fields
    inputs.forEach((input, index) => {
        const key = input.id;
        const value = input.value;
        //localStorage.setItem(key, value); // If you want to use local storage

        // Update the corresponding field with the current input value when in 'Save' mode
        if (editCombatantsButton.innerHTML === 'Save') {
            fields[index].innerText = value;
        }

        input.classList.toggle("hidden");
    });

    fields.forEach((field) => {
        field.classList.toggle("hidden");
    });

    // Toggle button text
    editCombatantsButton.innerHTML = (editCombatantsButton.innerHTML === 'Edit') ? 'Save' : 'Edit';
});




modalSubmitButton.addEventListener('click', () => {
    const nameInput = document.getElementById('name');
    const typeInput = document.getElementById('type');
    const hitpointsInput = document.getElementById('hitpoints');

    const name = nameInput.value;
    const type = typeInput.value;
    const hitpoints = hitpointsInput.value;

    const addedCombatant = new Combatant(name, type, hitpoints);

    addCombatantToEncounter(addedCombatant);

    // Reset the input values
    nameInput.value = '';
    typeInput.value = '';
    hitpointsInput.value = '';

    // Close the modal after submission
    modal.style.display = 'none';
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

function createDraggableItem(info) {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = info;
    tableRow.setAttribute('draggable', 'true'); // Make the entire row draggable
    console.log(info);
    return tableRow;
}

function addCombatantToEncounter(combatant) {
    combatantTableRow = document.createElement('tr');
    combatantTableRow.setAttribute('id', combatant.name);
    combatantTableRow.setAttribute('draggable', 'true'); // Make the entire row draggable

    combatantTableRow.innerHTML = `
        <td>
            <input class="input hidden" id='${combatant.name}-name' type='text' value='${combatant.name}'>
            <div class="field">${combatant.name}</div>
        </td>
        <td>
            <input class="input hidden" id='${combatant.name}-init' type='text'>
            <div class="field">0</div>
        </td>
        <td>
            <input class="input hidden" id='${combatant.name}-type' type='text' value='${combatant.type}'>
            <div class="field">${combatant.type}</div>
        </td>
        <td>
            <input class="input hidden" id='${combatant.name}-currenthp' type='number' value='${combatant.hitpoints}'>
            <div class="field">${combatant.hitpoints}</div>
        </td>
        <td>
            <input class="input hidden" id='${combatant.name}-totalhp' type='number' value='${combatant.hitpoints}'>
            <div class="field">${combatant.hitpoints}</div>
        </td>`;

    encounterBody.appendChild(combatantTableRow);
}


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