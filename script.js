// let sessionId = ''; // Store the session ID globally

// async function authenticate(username, password) {
//     console.log("Authenticating user...");
//     const response = await fetch('http://localhost:3020/auth', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//         const errorMessage = data.errors && data.errors.length > 0 
//             ? data.errors[0].message 
//             : data.responseMessage || 'Authentication failed';
//         console.error("Authentication error:", errorMessage);
//         throw new Error(errorMessage);
//     }

//     console.log("Authentication successful, session ID:", data.sessionId);
//     return data.sessionId;
// }

// document.getElementById('logIn').addEventListener('click', async function() {
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;
//     const errorMessageDiv = document.getElementById('errorMessage');
//     errorMessageDiv.style.display = 'none';

//     try {
//         sessionId = await authenticate(username, password);
//         sessionStorage.setItem('sessionId', sessionId);

//         // Fade out the login section
//         const loginContainer = document.getElementById('credentials');
//         loginContainer.style.transition = 'opacity 0.5s'; // Set transition
//         loginContainer.style.opacity = '0'; // Start fade out

//         setTimeout(() => {
//             loginContainer.style.display = 'none'; // Hide login section
//             const header = document.getElementById('header');
//             header.style.display = 'block'; // Make header visible
//             header.style.opacity = '0'; // Start header invisible
//             header.style.transition = 'opacity 0.5s'; // Set transition
//             header.style.opacity = '1'; // Fade in header
//             document.querySelector('.search-container').style.display = 'block'; // Show search container
//         }, 500); // Wait for the fade-out duration
//     } catch (error) {
//         errorMessageDiv.textContent = error.message;
//         errorMessageDiv.style.display = 'block';
//     }
// });

// let isSearching = false; // Flag to track search state

// async function searchAllObjects(searchQuery) {
//     const queries = {
//         documents: `http://localhost:3020/api/v24.2/query?q=SELECT document_number__v, name__v, type__v, subtype__v, version_id FROM documents FIND('${searchQuery}' SCOPE ALL)`,
//         study: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, state__v, study_type__v, study_subtype__v FROM study__v FIND('${searchQuery}')`,
//         study_country: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, study__vr.name__v FROM study_country__v FIND('${searchQuery}')`,
//         site: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, study__vr.name__v, study_country__vr.name__v FROM site__v FIND('${searchQuery}')`,
//         product: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, status__v, abbreviation__c FROM product__v FIND('${searchQuery}')`,
//         study_personnel: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, team_role__v, study__clinr.name__v, study_country__clinr.name__v, site__clinr.name__v FROM study_person__clin FIND('${searchQuery}')`,
//         organization: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, organization__v, study__vr.name__v, study_country__vr.name__v, site__v FROM study_organization__v FIND('${searchQuery}')`,
//         study_product: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, product_role__vr.name__v, study__vr.name__v, product__vr.name__v FROM study_product__v FIND('${searchQuery}')`,
//         visit_definition: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, sequence__v, study__vr.name__v FROM visit_def__v FIND('${searchQuery}')`,
//         monitoring_events: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, object_type__vr.name__v, state__v, study__ctmsr.name__v, study_country__ctmsr.name__v, site__ctmsr.name__v FROM monitoring_event__ctms FIND('${searchQuery}')`,
//         milestone: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, status__v, complete__v, state__v, milestone_type__v, study__vr.name__v FROM milestone__v FIND('${searchQuery}')`,
//         expected_document: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, object_type__vr.name__v, edl__vr.name__v, type__v, subtype__v FROM edl_item__v FIND('${searchQuery}')`,
//         subject: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, subject_status__clin, study__clinr.name__v, study_country__clinr.name__v, site__clinr.name__v FROM subject__clin FIND('${searchQuery}')`,
//         subject_visit: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, visit_def__vr.name__v, visit_status__v, subject__vr.name__v, study__vr.name__v, study_country__vr.name__v, site__vr.name__v FROM visit__v FIND('${searchQuery}')`
//     };

//     const results = {};

//     for (const [key, query] of Object.entries(queries)) {
//         const response = await fetch(query, {
//             method: 'GET',
//             headers: { 
//                 'Authorization': `Bearer ${sessionId}`,
//                 'Accept': 'application/json'
//             },
//         });

//         if (!response.ok) {
//             const data = await response.json();
//             console.error(`Search error for ${key}:`, data);
//             continue; // Skip to next query
//         }

//         const data = await response.json();
//         if (data.data && Array.isArray(data.data)) {
//             results[key] = data.data; // Store results for each object type
//         }
//     }

//     return results;
// }

// async function displayResults(results) {
//     const resultsContainer = document.getElementById('resultsContainer');
//     resultsContainer.innerHTML = ''; // Clear previous results

//     let totalRecords = 0;

//     // Check for and display results for each type
//     for (const [key, items] of Object.entries(results)) {
//         if (items && items.length > 0) {
//             totalRecords += items.length;

//             const sectionHeader = document.createElement('h3');
//             sectionHeader.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ':';
//             resultsContainer.appendChild(sectionHeader);

//             const table = document.createElement('table');
//             table.className = 'table table-bordered table-striped'; // Bootstrap classes

//             const headerRow = document.createElement('tr');
//             let headers = getHeadersForKey(key);

//             headers.forEach(headerText => {
//                 const th = document.createElement('th');
//                 th.textContent = headerText;
//                 headerRow.appendChild(th);
//             });
//             table.appendChild(headerRow);

//             // Populate table rows with data
//             items.forEach(item => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = generateRowHTML(key, item);
//                 table.appendChild(row);
//             });

//             resultsContainer.appendChild(table); // Add table to results container
//         }
//     }

//     const totalRecordsDiv = document.getElementById('totalRecords');
//     totalRecordsDiv.textContent = `Total Records Found: ${totalRecords}`;
// }

// function getHeadersForKey(key) {
//     switch (key) {
//         case 'documents':
//             return ['Document Number', 'Name', 'Type', 'Subtype'];
//         case 'study':
//             return ['ID', 'Name', 'State'];
//         case 'study_country':
//             return ['ID', 'Name', 'Study'];
//         case 'site':
//             return ['Name', 'Study', 'Study Country'];
//         case 'product':
//             return ['ID', 'Name', 'Status', 'Abbreviation'];
//         case 'study_personnel':
//             return ['ID', 'Name', 'Team Role', 'Study', 'Study Country', 'Site'];
//         case 'organization':
//             return ['ID', 'Name', 'Organization', 'Study', 'Study Country', 'Site'];
//         case 'study_product':
//             return ['ID', 'Name', 'Product Role', 'Study', 'Product'];
//         case 'visit_definition':
//             return ['ID', 'Name', 'Sequence', 'Study'];
//         case 'monitoring_events':
//             return ['ID', 'Name', 'Object Type', 'State', 'Study', 'Study Country', 'Site'];
//         case 'milestone':
//             return ['ID', 'Name', 'Status', 'Complete', 'State', 'Milestone Type', 'Study'];
//         case 'expected_document':
//             return ['ID', 'Name', 'Object Type', 'EDL', 'Type', 'Subtype'];
//         case 'subject':
//             return ['ID', 'Name', 'Subject Status', 'Study', 'Study Country', 'Site'];
//         case 'subject_visit':
//             return ['ID', 'Name', 'Visit Definition', 'Visit Status', 'Subject', 'Study', 'Study Country', 'Site'];
//         default:
//             return []; // No headers for unrecognized keys
//     }
// }

// function generateRowHTML(key, item) {
//     switch (key) {
//         case 'documents':
//             return `
//                 <td>${item.document_number__v || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#doc_info/${item.version_id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.type__v || 'N/A'}</td>
//                 <td>${item.subtype__v || 'N/A'}</td>
//             `;
//         case 'study':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.state__v || 'N/A'}</td>
//             `;
//         case 'study_country':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'site':
//             return `
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'product':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item.status__v || 'N/A'}</td>
//                 <td>${item.abbreviation__c || 'N/A'}</td>
//             `;
//         case 'study_personnel':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item.team_role__v || 'N/A'}</td>
//                 <td>${item['study__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__clinr.name__v'] || 'N/A'}</td>
//             `;
//         case 'organization':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item.organization__v || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.site__v || 'N/A'}</td>
//             `;
//         case 'study_product':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item['product_role__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['product__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'visit_definition':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item.sequence__v || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'monitoring_events':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item['object_type__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.state__v || 'N/A'}</td>
//                 <td>${item['study__ctmsr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__ctmsr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__ctmsr.name__v'] || 'N/A'}</td>
//             `;
//         case 'milestone':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item.status__v || 'N/A'}</td>
//                 <td>${item.complete__v || 'N/A'}</td>
//                 <td>${item.state__v || 'N/A'}</td>
//                 <td>${item.milestone_type__v || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'expected_document':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item['object_type__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['edl__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.type__v || 'N/A'}</td>
//                 <td>${item.subtype__v || 'N/A'}</td>
//             `;
//         case 'subject':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item.subject_status__clin || 'N/A'}</td>
//                 <td>${item['study__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__clinr.name__v'] || 'N/A'}</td>
//             `;
//         case 'subject_visit':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item['visit_def__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.visit_status__v || 'N/A'}</td>
//                 <td>${item['subject__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__vr.name__v'] || 'N/A'}</td>
//             `;
//         default:
//             return ''; // No HTML for unrecognized keys
//     }
// }

// // Search button event listener
// document.getElementById('searchButton').addEventListener('click', async function() {
//     const searchInput = document.getElementById('searchInput').value;
//     if (!isSearching && searchInput) {
//         isSearching = true;
//         try {
//             const results = await searchAllObjects(searchInput);
//             await displayResults(results);
//         } catch (error) {
//             console.error("Error during search:", error);
//         } finally {
//             isSearching = false;
//         }
//     }
// });

let sessionId = ''; // Store the session ID globally
let isSearching = false; // Flag to track search state

// Function to show the loader
function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader'; // Use the loader class
    document.body.appendChild(loader); // Append loader to the body
}

// Function to hide the loader
function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove(); // Remove loader from the DOM
    }
}

async function authenticate(username, password) {
        console.log("Authenticating user...");
        const response = await fetch('http://localhost:3020/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 
                ? data.errors[0].message 
                : data.responseMessage || 'Authentication failed';
            console.error("Authentication error:", errorMessage);
            throw new Error(errorMessage);
        }
    
        console.log("Authentication successful, session ID:", data.sessionId);
        return data.sessionId;
    }

document.getElementById('logIn').addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.style.display = 'none';

    try {
        sessionId = await authenticate(username, password);
        sessionStorage.setItem('sessionId', sessionId);

        // Fade out the login section
        const loginContainer = document.getElementById('credentials');
        loginContainer.style.transition = 'opacity 0.5s';
        loginContainer.style.opacity = '0';

        setTimeout(() => {
            loginContainer.style.display = 'none';
            
            // Display header and search input
            const header = document.getElementById('header');
            header.style.display = 'block';
            header.style.opacity = '0';
            header.style.transition = 'opacity 0.5s';
            header.style.opacity = '1';

            // Show the search container
            document.querySelector('.search-container').style.display = 'block';

            // Populate the object names container
            const objectNamesContainer = document.getElementById('objectNamesContainer');
            objectNamesContainer.innerHTML = ''; // Clear previous content

            // Define object names with initial counts
            const objectNames = [
                'Documents',
                'Study',
                'Study Country',
                'Site',
                'Study Personnel',
                'Organization',
                'Study Product',
                'Visit Definition',
                'Monitoring Events',
                'Milestone',
                'Expected Document',
                'Subject',
                'Subject Visit'
            ];

            // Create buttons for each object name
            objectNames.forEach(name => {
                const button = document.createElement('button');
                button.className = 'object-button';
                button.dataset.key = name.toLowerCase().replace(/\s/g, '_'); // Set a data key based on the name
                button.innerHTML = `${name} (0)`; // Initially set count to 0
                button.style.width = '100%'; // Make button full width to occupy the row
                objectNamesContainer.appendChild(button);
            });

            // Show the object names container in a vertical layout
            objectNamesContainer.style.display = 'block'; // Ensure container is visible

        }, 500); // Wait for the fade-out duration
    } catch (error) {
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = 'block';
    }
});





async function searchAllObjects(searchQuery) {
    const queries = {
        documents: `http://localhost:3020/api/v24.2/query?q=SELECT document_number__v, name__v, type__v, subtype__v, version_id FROM documents FIND('${searchQuery}' SCOPE ALL)`,
        study: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, state__v, study_type__v, study_subtype__v FROM study__v FIND('${searchQuery}')`,
        study_country: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, study__vr.name__v FROM study_country__v FIND('${searchQuery}')`,
        site: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, study__vr.name__v, study_country__vr.name__v FROM site__v FIND('${searchQuery}')`,
        study_personnel: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, team_role__v, study__clinr.name__v, study_country__clinr.name__v, site__clinr.name__v FROM study_person__clin FIND('${searchQuery}')`,
        organization: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, organization__v, study__vr.name__v, study_country__vr.name__v, site__v FROM study_organization__v FIND('${searchQuery}')`,
        study_product: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, product_role__vr.name__v, study__vr.name__v, product__vr.name__v FROM study_product__v FIND('${searchQuery}')`,
        visit_definition: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, sequence__v, study__vr.name__v FROM visit_def__v FIND('${searchQuery}')`,
        monitoring_events: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, object_type__vr.name__v, state__v, study__ctmsr.name__v, study_country__ctmsr.name__v, site__ctmsr.name__v FROM monitoring_event__ctms FIND('${searchQuery}')`,
        milestone: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, status__v, complete__v, state__v, milestone_type__v, study__vr.name__v FROM milestone__v FIND('${searchQuery}')`,
        expected_document: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, object_type__vr.name__v, edl__vr.name__v, type__v, subtype__v FROM edl_item__v FIND('${searchQuery}')`,
        subject: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, subject_status__clin, study__clinr.name__v, study_country__clinr.name__v, site__clinr.name__v FROM subject__clin FIND('${searchQuery}')`,
        subject_visit: `http://localhost:3020/api/v24.2/query?q=SELECT id, name__v, visit_def__vr.name__v, visit_status__v, subject__vr.name__v, study__vr.name__v, study_country__vr.name__v, site__vr.name__v FROM visit__v FIND('${searchQuery}')`
    };

    const results = {};
    
    for (const [key, query] of Object.entries(queries)) {
        const response = await fetch(query, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${sessionId}`,
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            const data = await response.json();
            console.error(`Search error for ${key}:`, data);
            continue; // Skip to next query
        }

        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
            results[key] = data.data; // Store results for each object type
        }
    }

    return results;
}

async function displayResults(results) {
    hideLoader();
    const objectNamesContainer = document.getElementById('objectNamesContainer');
    const modalDataContent = document.getElementById('modalDataContent');

    // Clear previous object names and data
    objectNamesContainer.innerHTML = ''; 
    modalDataContent.innerHTML = ''; 

    let totalRecords = 0;

    // Create buttons for each object type
    for (const [key, items] of Object.entries(results)) {
        const itemCount = items ? items.length : 0;
        totalRecords += itemCount;

        // Create a button for the object name with its count
        const button = document.createElement('button');
        button.className = 'object-button';
        button.dataset.key = key;
        button.innerHTML = `${key.charAt(0).toUpperCase() + key.slice(1)} (${itemCount})`;
        objectNamesContainer.appendChild(button);
    }

    // Show the object names container
    objectNamesContainer.style.display = 'block';

    document.querySelectorAll('.object-button').forEach(button => {
        button.addEventListener('click', function() {
            const key = this.dataset.key;
            const items = results[key]; // Get the items directly from results
            displayObjectData(key, items); // Function to display selected object data
        });
    });
}

// async function displayResults(results) {
//     hideLoader();
//     const objectNamesContainer = document.getElementById('objectNamesContainer');
//     const dataDisplayContainer = document.getElementById('dataDisplayContainer');

//     // Clear previous object names and data
//     objectNamesContainer.innerHTML = ''; 
//     dataDisplayContainer.innerHTML = ''; 

//     let totalRecords = 0;

//     // Create buttons for each object type
//     for (const [key, items] of Object.entries(results)) {
//         const itemCount = items ? items.length : 0;
//         totalRecords += itemCount;

//         // Create a button for the object name with its count
//         const button = document.createElement('button');
//         button.className = 'object-button';
//         button.dataset.key = key;
//         button.innerHTML = `${key.charAt(0).toUpperCase() + key.slice(1)} (${itemCount})`;
//         objectNamesContainer.appendChild(button);
//     }

//     // Show the object names container
//     objectNamesContainer.style.display = 'block';

//     // const totalRecordsDiv = document.getElementById('totalRecords');
//     // totalRecordsDiv.textContent = `Total Records Found: ${totalRecords}`;

//     // Add click event listeners to the buttons
//     document.querySelectorAll('.object-button').forEach(button => {
//         button.addEventListener('click', function() {
//             const key = this.dataset.key;
//             const items = results[key]; // Get the items directly from results
//             displayObjectData(key, items); // Function to display selected object data
//         });
//     });
// }

// function displayObjectData(key, items) {
//     const dataDisplayContainer = document.getElementById('dataDisplayContainer');
//     dataDisplayContainer.innerHTML = ''; // Clear previous data

//     if (items && items.length > 0) {
//         const table = document.createElement('table');
//         const headerRow = document.createElement('tr');
//         const headers = getHeadersForKey(key);

//         headers.forEach(headerText => {
//             const th = document.createElement('th');
//             th.textContent = headerText;
//             headerRow.appendChild(th);
//         });
//         table.appendChild(headerRow);

//         // Populate table rows with data
//         items.forEach(item => {
//             const row = document.createElement('tr');
//             row.innerHTML = generateRowHTML(key, item);
//             table.appendChild(row);
//         });

//         dataDisplayContainer.appendChild(table); // Add table to data display container
//         dataDisplayContainer.style.display = 'block'; // Show data display container
//     } else {
//         dataDisplayContainer.innerHTML = 'No records found.';
//         dataDisplayContainer.style.display = 'block'; // Show message if no records found
//     }
// }

// function displayObjectData(key, items) {
//     const modalDataContent = document.getElementById('modalDataContent');
//     modalDataContent.innerHTML = ''; // Clear previous data

//     if (items && items.length > 0) {
//         const table = document.createElement('table');
//         const headerRow = document.createElement('tr');
//         const headers = getHeadersForKey(key);

//         headers.forEach(headerText => {
//             const th = document.createElement('th');
//             th.textContent = headerText;
//             headerRow.appendChild(th);
//         });
//         table.appendChild(headerRow);

//         // Populate table rows with data
//         items.forEach(item => {
//             const row = document.createElement('tr');
//             row.innerHTML = generateRowHTML(key, item);
//             table.appendChild(row);
//         });

//         modalDataContent.appendChild(table); // Add table to modal content
//         modalDataContent.style.display = 'block'; // Show modal
//         document.getElementById('dataModal').style.display = 'block'; // Display the modal
//     } else {
//         modalDataContent.innerHTML = 'No records found.';
//         modalDataContent.style.display = 'block'; // Show message if no records found
//         document.getElementById('dataModal').style.display = 'block'; // Display the modal
//     }
// }

// function getHeadersForKey(key) {
//     switch (key) {
//         case 'documents':
//             return ['Name'];
//         case 'study':
//             return ['Name'];
//         case 'study_country':
//             return ['Name'];
//         case 'site':
//             return ['Name'];
//         case 'product':
//             return ['Name'];
//         case 'study_personnel':
//             return ['Name'];
//         case 'organization':
//             return ['Name'];
//         case 'study_product':
//             return ['Name'];
//         case 'visit_definition':
//             return ['Name'];
//         case 'monitoring_events':
//             return ['Name'];
//         case 'milestone':
//             return ['Name'];
//         case 'expected_document':
//             return ['Name'];
//         case 'subject':
//             return ['Name'];
//         case 'subject_visit':
//             return ['Name'];
//         default:
//             return []; // No headers found for this type
//     }
// }

function displayObjectData(key, items) {
    const modalDataContent = document.getElementById('modalDataContent');
    modalDataContent.innerHTML = ''; // Clear previous data

    // Set the heading with a class for styling
    const heading = `<h2 class="modal-heading">${key.charAt(0).toUpperCase() + key.slice(1)}</h2>`;
    modalDataContent.innerHTML += heading;

    // Add horizontal line below the heading
    modalDataContent.innerHTML += '<hr class="modal-divider">';

    if (items && items.length > 0) {
        items.forEach(item => {
            modalDataContent.innerHTML += generateRowHTML(key, item);
        });
    } else {
        modalDataContent.innerHTML += '<p class="no-records">No records found.</p>';
    }

    modalDataContent.style.display = 'block'; // Show modal content
    document.getElementById('dataModal').style.display = 'block'; // Display the modal
}

function generateRowHTML(key, item) {
    const recordName = item.name__v || 'N/A'; // Get the object name to display
    let link = '';

    switch (key) {
        case 'documents':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#doc_info/${item.version_id}`;
            break;
        case 'study':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'study_country':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'site':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'study_personnel':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'organization':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'study_product':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'visit_definition':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'monitoring_events':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'milestone':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'expected_document':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'subject':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        case 'subject_visit':
            link = `https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}`;
            break;
        default:
            return ''; // No HTML for unrecognized keys
    }

    // Return the link wrapped in a div for vertical stacking with margin
    return `
        <div style="margin-bottom: 10px;">
            <a href="${link}" target="_blank" class="custom-link">${recordName}</a>
        </div>
    `;
}



function closeModal(event) {
    if (event.target === document.getElementById('dataModal')) {
        document.getElementById('dataModal').style.display = 'none';
    }
}




// function generateRowHTML(key, item) {
//     switch (key) {
//         case 'documents':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#doc_info/${item.version_id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'study':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'study_country':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a> `;
//         case 'site':
//             return ` <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'product':
//             return `
//                 <td>${item.name__v || 'N/A'}</td>
//             `;
//         case 'study_personnel':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'organization':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'study_product':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'visit_definition':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'monitoring_events':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'milestone':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'expected_document':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'subject':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         case 'subject_visit':
//             return `<a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>`;
//         default:
//             return ''; // No HTML for unrecognized keys
//     }
// }


// Get headers based on object type
// function getHeadersForKey(key) {
//     switch (key) {
//         case 'documents':
//             return ['Document Number', 'Name', 'Type', 'Subtype'];
//         case 'study':
//             return ['ID', 'Name', 'State'];
//         case 'study_country':
//             return ['ID', 'Name', 'Study'];
//         case 'site':
//             return ['Name', 'Study', 'Study Country'];
//         case 'product':
//             return ['ID', 'Name', 'Status', 'Abbreviation'];
//         case 'study_personnel':
//             return ['ID', 'Name', 'Team Role', 'Study', 'Study Country', 'Site'];
//         case 'organization':
//             return ['ID', 'Name', 'Organization', 'Study', 'Study Country', 'Site'];
//         case 'study_product':
//             return ['ID', 'Name', 'Product Role', 'Study', 'Product'];
//         case 'visit_definition':
//             return ['ID', 'Name', 'Sequence', 'Study'];
//         case 'monitoring_events':
//             return ['ID', 'Name', 'Object Type', 'State', 'Study', 'Study Country', 'Site'];
//         case 'milestone':
//             return ['ID', 'Name', 'Status', 'Complete', 'State', 'Milestone Type', 'Study'];
//         case 'expected_document':
//             return ['ID', 'Name', 'Object Type', 'EDL', 'Type', 'Subtype'];
//         case 'subject':
//             return ['ID', 'Name', 'Subject Status', 'Study', 'Study Country', 'Site'];
//         case 'subject_visit':
//             return ['ID', 'Name', 'Visit Definition', 'Visit Status', 'Subject', 'Study', 'Study Country', 'Site'];
//         default:
//             return []; // No headers found for this type
//     }
// }

// Generate HTML for a table row based on key and item
// function generateRowHTML(key, item) {
//     switch (key) {
//         case 'documents':
//             return `
//                 <td>${item.document_number__v || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#doc_info/${item.version_id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.type__v || 'N/A'}</td>
//                 <td>${item.subtype__v || 'N/A'}</td>
//             `;
//         case 'study':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.state__v || 'N/A'}</td>
//             `;
//         case 'study_country':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'site':
//             return `
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'product':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td>${item.name__v || 'N/A'}</td>
//                 <td>${item.status__v || 'N/A'}</td>
//                 <td>${item.abbreviation__c || 'N/A'}</td>
//             `;
//         case 'study_personnel':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.team_role__v || 'N/A'}</td>
//                 <td>${item['study__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__clinr.name__v'] || 'N/A'}</td>
//             `;
//         case 'organization':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.organization__v || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.site__v || 'N/A'}</td>
//             `;
//         case 'study_product':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['product_role__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['product__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'visit_definition':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.sequence__v || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'monitoring_events':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['object_type__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.state__v || 'N/A'}</td>
//                 <td>${item['study__ctmsr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__ctmsr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__ctmsr.name__v'] || 'N/A'}</td>
//             `;
//         case 'milestone':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.status__v || 'N/A'}</td>
//                 <td>${item.complete__v || 'N/A'}</td>
//                 <td>${item.state__v || 'N/A'}</td>
//                 <td>${item.milestone_type__v || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//             `;
//         case 'expected_document':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['object_type__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['edl__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.type__v || 'N/A'}</td>
//                 <td>${item.subtype__v || 'N/A'}</td>
//             `;
//         case 'subject':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item.subject_status__clin || 'N/A'}</td>
//                 <td>${item['study__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__clinr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__clinr.name__v'] || 'N/A'}</td>
//             `;
//         case 'subject_visit':
//             return `
//                 <td>${item.id || 'N/A'}</td>
//                 <td class="link">
//                     <a href="https://partnersi-prana4life-clinical.veevavault.com/ui/#t/0TB000000000K15/${item.id}" class="text-primary">${item.name__v || 'N/A'}</a>
//                 </td>
//                 <td>${item['visit_def__vr.name__v'] || 'N/A'}</td>
//                 <td>${item.visit_status__v || 'N/A'}</td>
//                 <td>${item['subject__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['study_country__vr.name__v'] || 'N/A'}</td>
//                 <td>${item['site__vr.name__v'] || 'N/A'}</td>
//             `;
//         default:
//             return ''; // No HTML for unrecognized keys
//     }
// }


document.getElementById('searchButton').addEventListener('click', async function() {
    if (isSearching) return; // Prevent multiple searches

    const searchQuery = document.getElementById('searchInput').value;
    const errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.style.display = 'none';
    
    try {
        isSearching = true; // Set searching flag
        showLoader(); // Show loader while fetching data

        const results = await searchAllObjects(searchQuery);
        await displayResults(results);
        
        hideLoader(); // Hide loader immediately before displaying results
    } catch (error) {
        console.error("Search error:", error);
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.style.display = 'block';
        hideLoader(); // Ensure loader is hidden even on error
    } finally {
        isSearching = false; // Reset searching flag
    }
});

document.getElementById('logo1').addEventListener('click', function() {
    const objectNamesContainer = document.getElementById('objectNamesContainer');
    const dataDisplayContainer = document.getElementById('dataDisplayContainer');

    // Populate the object names container
    objectNamesContainer.innerHTML = ''; // Clear previous content

    // Define object names with initial counts
    const objectNames = [
        'Documents',
        'Study',
        'Study Country',
        'Site',
        'Study Personnel',
        'Organization',
        'Study Product',
        'Visit Definition',
        'Monitoring Events',
        'Milestone',
        'Expected Document',
        'Subject',
        'Subject Visit'
    ];

    // Create buttons for each object name
    objectNames.forEach(name => {
        const button = document.createElement('button');
        button.className = 'object-button';
        button.dataset.key = name.toLowerCase().replace(/\s/g, '_'); // Set a data key based on the name
        button.innerHTML = `${name} (0)`; // Initially set count to 0
        button.style.width = '100%'; // Make button full width to occupy the row
        objectNamesContainer.appendChild(button);
    });

    // Show the object names container in a vertical layout
    objectNamesContainer.style.display = 'block'; // Ensure container is visible 

    dataDisplayContainer.style.display = 'none'; 

    // You can also refresh or reset the search input
    document.getElementById('searchInput').value = '';
});