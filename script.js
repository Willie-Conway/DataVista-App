// ======================
// AUTHENTICATION SECTION
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authModal = document.getElementById('auth-modal');
    const appContainer = document.getElementById('app-container');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const closeAuthModal = document.getElementById('close-auth-modal');
    
    // User state
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    // Check authentication on load
    if (currentUser) {
        initializeApp(currentUser);
    } else {
        authModal.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }
    
    // Auth tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            authTabs.forEach(t => t.classList.remove('active', 'text-indigo-600', 'border-b-2', 'border-indigo-600', 'dark:text-indigo-400', 'dark:border-indigo-400'));
            tab.classList.add('active', 'text-indigo-600', 'border-b-2', 'border-indigo-600', 'dark:text-indigo-400', 'dark:border-indigo-400');
            
            authForms.forEach(form => form.classList.add('hidden'));
            document.getElementById(`${tabId}-form`).classList.remove('hidden');
        });
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simulate authentication
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            loginForm.reset();
            authModal.classList.add('hidden');
            initializeApp(user);
            showNotification(`Welcome back, ${user.name}!`);
            
            // Switch to dashboard
            document.querySelector('[data-tab="dashboard"]').click();
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
        }
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        // Validate inputs
        if (!name || !email || !password) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.email === email)) {
            showNotification('Email already exists. Please login instead.', 'error');
            return;
        }
        
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            password, 
            role: 'User',
            profilePicture: 'https://www.gravatar.com/avatar/?d=identicon'
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        signupForm.reset();
        authModal.classList.add('hidden');
        appContainer.classList.remove('hidden');
        initializeApp(newUser);
        showNotification(`Welcome to DataVisa, ${name}!`);
        
        // Switch to dashboard
        document.querySelector('[data-tab="dashboard"]').click();
    });
    
    // Close auth modal
    closeAuthModal.addEventListener('click', () => {
        if (!currentUser) {
            showNotification('Please login or sign up to continue', 'error');
            return;
        }
        authModal.classList.add('hidden');
    });
    
    // Initialize app after authentication
    function initializeApp(user) {
        appContainer.classList.remove('hidden');
        updateUserUI(user);
        initializeAllFeatures();
        
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    
    // Update UI with user info
    function updateUserUI(user) {
        document.getElementById('username-display').textContent = user.name;
        document.getElementById('user-role-display').textContent = user.role;
        document.getElementById('profile-username').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-role').textContent = user.role;
        
        // Set profile picture
        const profileImgContainer = document.getElementById('profile-img-container');
        profileImgContainer.innerHTML = `
            <img src="${user.profilePicture || 'https://www.gravatar.com/avatar/?d=identicon'}" 
                 alt="${user.name}" 
                 class="w-full h-full object-cover rounded-full">
        `;
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Logout functionality
    document.getElementById('logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            currentUser = null;
            appContainer.classList.add('hidden');
            authModal.classList.remove('hidden');
            showNotification('You have been logged out successfully.');
            
            // Switch to login tab
            document.querySelector('.auth-tab[data-tab="login"]').click();
        }
    });
});

// ======================
// DASHBOARD SECTION
// ======================
function initializeDashboard() {
    // Update dashboard stats
    updateDashboardStats();
    
    // Recent activity
    const activityLog = [
        { icon: 'fa-file-import', color: 'indigo', text: 'Imported Sales Data Q3', time: '2 hours ago' },
        { icon: 'fa-robot', color: 'green', text: 'Trained Random Forest model', time: '5 hours ago' },
        { icon: 'fa-chart-bar', color: 'blue', text: 'Created sales trend visualization', time: 'Yesterday' },
        { icon: 'fa-broom', color: 'purple', text: 'Cleaned customer demographics data', time: '2 days ago' }
    ];
    
    const activityContainer = document.querySelector('#dashboard .space-y-4');
    activityContainer.innerHTML = '';
    
    activityLog.forEach(activity => {
        activityContainer.innerHTML += `
            <div class="flex items-start">
                <div class="p-2 rounded-lg bg-${activity.color}-100 text-${activity.color}-600 mr-3 dark:bg-${activity.color}-900 dark:text-${activity.color}-300">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div>
                    <p class="font-medium dark:text-white">${activity.text}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${activity.time}</p>
                </div>
            </div>
        `;
    });
    
    // Quick insights
    const insights = [
        { icon: 'fa-arrow-up', color: 'green', text: 'Customer retention increased by <b>5%</b> this month' },
        { icon: 'fa-chart-line', color: 'blue', text: 'Sales peaked on <b>May 15</b>' },
        { icon: 'fa-exclamation-circle', color: 'yellow', text: '<b>2</b> datasets need cleaning' },
        { icon: 'fa-lightbulb', color: 'purple', text: 'Try <b>PCA</b> for dimensionality reduction' }
    ];
    
    const insightsContainer = document.querySelector('#dashboard ul.space-y-3');
    insightsContainer.innerHTML = '';
    
    insights.forEach(insight => {
        insightsContainer.innerHTML += `
            <li class="flex items-center dark:text-white">
                <span class="p-2 rounded-full bg-${insight.color}-100 text-${insight.color}-600 mr-3 dark:bg-${insight.color}-900 dark:text-${insight.color}-300">
                    <i class="fas ${insight.icon}"></i>
                </span>
                <span>${insight.text}</span>
            </li>
        `;
    });
}

function updateDashboardStats() {
    const datasets = JSON.parse(localStorage.getItem('datasets')) || [];
    const models = JSON.parse(localStorage.getItem('models')) || [];
    const visualizations = JSON.parse(localStorage.getItem('visualizations')) || [];
    
    document.querySelector('#dashboard [data-stat="datasets"]').textContent = datasets.length;
    document.querySelector('#dashboard [data-stat="models"]').textContent = models.length;
    document.querySelector('#dashboard [data-stat="visualizations"]').textContent = visualizations.length;
    
    // Update progress bars
    document.querySelector('#dashboard [data-progress="storage"]').style.width = `${Math.min(datasets.length * 20, 100)}%`;
    document.querySelector('#dashboard [data-progress="accuracy"]').style.width = '92%';
    document.querySelector('#dashboard [data-progress="new-viz"]').style.width = '75%';
}

// ======================
// DATA LOADING SECTION
// ======================
function initializeDataLoading() {
    // Tab switching
    const uploadTabBtns = document.querySelectorAll('.upload-tab-btn');
    const uploadTabContents = document.querySelectorAll('.upload-tab-content');
    
    uploadTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.uploadTab;
            
            uploadTabBtns.forEach(tab => {
                tab.classList.remove('text-indigo-700', 'border-b-2', 'border-indigo-600', 'dark:text-indigo-400', 'dark:border-indigo-400');
                tab.classList.add('text-gray-600', 'hover:text-indigo-700', 'dark:text-gray-400', 'dark:hover:text-indigo-400');
            });
            
            uploadTabContents.forEach(content => content.classList.add('hidden'));
            
            btn.classList.add('text-indigo-700', 'border-b-2', 'border-indigo-600', 'dark:text-indigo-400', 'dark:border-indigo-400');
            btn.classList.remove('text-gray-600', 'hover:text-indigo-700', 'dark:text-gray-400', 'dark:hover:text-indigo-400');
            document.getElementById(`upload-tab-${tabId}`).classList.remove('hidden');
        });
    });
    
    // File upload simulation
    document.querySelector('#upload-tab-local button')?.addEventListener('click', (e) => {
        e.preventDefault();
        const fileInput = document.querySelector('#upload-tab-local input[type="file"]');
        
        if (fileInput.files.length === 0) {
            showNotification('Please select a file first.', 'error');
            return;
        }
        
        const uploadProgress = document.getElementById('upload-progress');
        const uploadProgressBar = document.getElementById('upload-progress-bar');
        const uploadProgressPercent = document.getElementById('upload-progress-percent');
        
        uploadProgress.classList.remove('hidden');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Save dataset
                const datasets = JSON.parse(localStorage.getItem('datasets')) || [];
                const file = fileInput.files[0];
                datasets.push({
                    id: Date.now(),
                    name: file.name,
                    type: file.name.split('.').pop().toUpperCase(),
                    size: (file.size / 1024).toFixed(2) + ' KB',
                    date: new Date().toLocaleString(),
                    owner: JSON.parse(localStorage.getItem('currentUser')).id
                });
                localStorage.setItem('datasets', JSON.stringify(datasets));
                
                setTimeout(() => {
                    uploadProgress.classList.add('hidden');
                    uploadProgressBar.style.width = '0%';
                    uploadProgressPercent.textContent = '0%';
                    showNotification('File uploaded successfully!');
                    updateRecentDatasets();
                    updateDashboardStats();
                }, 500);
            }
            
            uploadProgressBar.style.width = `${progress}%`;
            uploadProgressPercent.textContent = `${Math.round(progress)}%`;
        }, 200);
    });
    
    // Sample data loading
    document.querySelectorAll('#upload-tab-sample button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sampleName = btn.textContent.trim();
            
            const datasets = JSON.parse(localStorage.getItem('datasets')) || [];
            datasets.push({
                id: Date.now(),
                name: sampleName,
                type: 'CSV',
                size: 'Sample',
                date: new Date().toLocaleString(),
                owner: JSON.parse(localStorage.getItem('currentUser')).id
            });
            localStorage.setItem('datasets', JSON.stringify(datasets));
            
            showNotification(`${sampleName} loaded successfully!`);
            updateRecentDatasets();
            updateDashboardStats();
        });
    });
    
    // URL import
    document.querySelector('#upload-tab-url button')?.addEventListener('click', (e) => {
        e.preventDefault();
        const urlInput = document.querySelector('#upload-tab-url input[type="text"]');
        
        if (!urlInput.value) {
            showNotification('Please enter a URL', 'error');
            return;
        }
        
        const datasets = JSON.parse(localStorage.getItem('datasets')) || [];
        datasets.push({
            id: Date.now(),
            name: `Imported from ${new URL(urlInput.value).hostname}`,
            type: 'URL',
            size: 'N/A',
            date: new Date().toLocaleString(),
            owner: JSON.parse(localStorage.getItem('currentUser')).id,
            url: urlInput.value
        });
        localStorage.setItem('datasets', JSON.stringify(datasets));
        urlInput.value = '';
        
        showNotification('Data imported successfully from URL!');
        updateRecentDatasets();
        updateDashboardStats();
    });
    
    // Update recent datasets list
    function updateRecentDatasets() {
        const currentUserId = JSON.parse(localStorage.getItem('currentUser'))?.id;
        const datasets = (JSON.parse(localStorage.getItem('datasets')) || [])
            .filter(dataset => dataset.owner === currentUserId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const recentList = document.querySelector('#data-load ul');
        recentList.innerHTML = '';
        
        datasets.slice(0, 5).forEach(dataset => {
            const iconClass = dataset.type === 'CSV' ? 'fa-file-csv text-indigo-500' : 
                            dataset.type === 'XLSX' ? 'fa-file-excel text-green-500' : 
                            'fa-file-alt text-blue-500';
            
            recentList.innerHTML += `
                <li class="flex items-center justify-between py-3">
                    <div class="flex items-center min-w-0">
                        <i class="fas ${iconClass} mr-3 dark:text-indigo-400"></i>
                        <span class="text-gray-700 font-medium dark:text-gray-300 truncate">${dataset.name}</span>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">${dataset.type}</span>
                        <button class="text-indigo-600 hover:text-indigo-800 text-sm dark:text-indigo-400 dark:hover:text-indigo-300 whitespace-nowrap">
                            <i class="fas fa-eye mr-1"></i>Preview
                        </button>
                        <button class="delete-dataset text-red-500 hover:text-red-700 text-sm dark:text-red-400 dark:hover:text-red-300" data-id="${dataset.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </li>
            `;
        });
        
        // Add delete handlers
        document.querySelectorAll('.delete-dataset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const datasetId = btn.dataset.id;
                if (confirm('Are you sure you want to delete this dataset?')) {
                    deleteDataset(datasetId);
                }
            });
        });
    }
    
    function deleteDataset(id) {
        let datasets = JSON.parse(localStorage.getItem('datasets')) || [];
        datasets = datasets.filter(dataset => dataset.id !== parseInt(id));
        localStorage.setItem('datasets', JSON.stringify(datasets));
        updateRecentDatasets();
        updateDashboardStats();
        showNotification('Dataset deleted successfully');
    }
    
    // Initial update
    updateRecentDatasets();
}

// ======================
// DATA CLEANING SECTION
// ======================
function initializeDataCleaning() {
    // Dataset selector
    const datasetSelect = document.getElementById('dataset-select-clean');
    updateDatasetSelect(datasetSelect);
    
    // Apply cleaning button
    document.querySelector('#data-clean button')?.addEventListener('click', () => {
        const selectedDataset = datasetSelect.value;
        const missingValues = document.querySelector('input[name="missing-values"]:checked').value;
        const removeDuplicates = document.querySelector('#data-clean input[type="checkbox"]').checked;
        const outlierMethod = document.querySelector('#data-clean select').value;
        
        showNotification(`Cleaning applied to ${datasetSelect.options[datasetSelect.selectedIndex].text}!`);
        updateQualityReport();
    });
    
    // Update quality report
    function updateQualityReport() {
        const qualityData = [
            { column: 'ProductID', missing: '0%', duplicates: '0', type: 'Integer' },
            { column: 'CustomerName', missing: '5%', duplicates: '10', type: 'String' },
            { column: 'Price', missing: '1%', duplicates: '0', type: 'Float' }
        ];
        
        const tableBody = document.querySelector('#data-clean tbody');
        tableBody.innerHTML = '';
        
        qualityData.forEach(row => {
            tableBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${row.column}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.missing}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.duplicates}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.type}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">View</button>
                    </td>
                </tr>
            `;
        });
    }
    
    // Initial update
    updateQualityReport();
}

// ======================
// PREPROCESSING SECTION
// ======================
function initializePreprocessing() {
    // Dataset selector
    const datasetSelect = document.getElementById('dataset-select-preprocess');
    updateDatasetSelect(datasetSelect, true);
    
    // Apply preprocessing button
    document.querySelector('#preprocessing button')?.addEventListener('click', () => {
        const selectedDataset = datasetSelect.value;
        const scalingMethod = document.querySelector('#preprocessing select:nth-of-type(1)').value;
        const encodingMethod = document.querySelector('#preprocessing select:nth-of-type(2)').value;
        const reductionMethod = document.querySelector('#preprocessing select:nth-of-type(3)').value;
        
        showNotification(`Preprocessing applied to ${datasetSelect.options[datasetSelect.selectedIndex].text}!`);
        updatePreprocessedPreview();
    });
    
    // Update preprocessed preview
    function updatePreprocessedPreview() {
        const preprocessedData = [
            { feature1: '0.23', feature2: '0.87', categorical: '1', target: 'Class A' },
            { feature1: '0.56', feature2: '0.12', categorical: '0', target: 'Class B' }
        ];
        
        const tableBody = document.querySelector('#preprocessing tbody');
        tableBody.innerHTML = '';
        
        preprocessedData.forEach(row => {
            tableBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${row.feature1}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.feature2}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.categorical}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.target}</td>
                </tr>
            `;
        });
    }
    
    // Initial update
    updatePreprocessedPreview();
}

// Helper function to update dataset selects
function updateDatasetSelect(selectElement, showCleaned = false) {
    const currentUserId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    const datasets = (JSON.parse(localStorage.getItem('datasets')) || [])
        .filter(dataset => dataset.owner === currentUserId);
    
    selectElement.innerHTML = '';
    datasets.forEach(dataset => {
        const option = document.createElement('option');
        option.value = dataset.id;
        option.textContent = showCleaned ? `${dataset.name} (Cleaned)` : dataset.name;
        selectElement.appendChild(option);
    });
    
    if (datasets.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No datasets available';
        option.disabled = true;
        selectElement.appendChild(option);
    }
}

// ======================
// STATISTICS SECTION
// ======================
function initializeStatistics() {
    // Dataset selector
    const datasetSelect = document.getElementById('dataset-select-stats');
    updateDatasetSelect(datasetSelect, true);
    
    // Generate report button
    document.querySelector('#stats button')?.addEventListener('click', () => {
        const selectedDataset = datasetSelect.value;
        showNotification(`Statistical report generated for ${datasetSelect.options[datasetSelect.selectedIndex].text}!`);
        updateStatisticalSummary();
    });
    
    // Update statistical summary
    function updateStatisticalSummary() {
        const statsData = [
            { metric: 'Mean', colA: '50.2', colB: '12.8', colC: '2.5' },
            { metric: 'Median', colA: '49.0', colB: '12.0', colC: '2.0' },
            { metric: 'Std Dev', colA: '15.1', colB: '3.5', colC: '0.8' }
        ];
        
        const tableBody = document.querySelector('#stats tbody');
        tableBody.innerHTML = '';
        
        statsData.forEach(row => {
            tableBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${row.metric}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.colA}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.colB}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.colC}</td>
                </tr>
            `;
        });
    }
    
    // Initial update
    updateStatisticalSummary();
}

// ======================
// MACHINE LEARNING SECTION
// ======================
function initializeMachineLearning() {
    // Dataset selector
    const datasetSelect = document.getElementById('dataset-select-ml');
    updateDatasetSelect(datasetSelect, true);
    
    // Target variable selector
    const targetSelect = document.getElementById('target-variable');
    ['Revenue', 'Churn', 'Category'].forEach(col => {
        const option = document.createElement('option');
        option.value = col.toLowerCase();
        option.textContent = col;
        targetSelect.appendChild(option);
    });
    
    // Train model button
    document.querySelector('#ml button')?.addEventListener('click', () => {
        const selectedDataset = datasetSelect.value;
        const targetVariable = targetSelect.value;
        const modelType = document.getElementById('model-type').value;
        const algorithm = document.getElementById('algorithm').value;
        
        showNotification(`Training ${algorithm} model for ${targetVariable} prediction...`);
        
        // Simulate training
        setTimeout(() => {
            showNotification(`${algorithm} model trained successfully!`);
            updateModelPerformance();
            
            // Save model
            const models = JSON.parse(localStorage.getItem('models')) || [];
            models.push({
                id: Date.now(),
                name: `${algorithm} for ${targetVariable}`,
                type: modelType,
                algorithm,
                accuracy: (Math.random() * 0.2 + 0.8).toFixed(2),
                date: new Date().toLocaleString(),
                owner: JSON.parse(localStorage.getItem('currentUser')).id
            });
            localStorage.setItem('models', JSON.stringify(models));
            updateDashboardStats();
        }, 2000);
    });
    
    // Update model performance
    function updateModelPerformance() {
        const performanceData = [
            { metric: 'Accuracy', score: '0.92' },
            { metric: 'Precision', score: '0.88' },
            { metric: 'Recall', score: '0.95' },
            { metric: 'F1-Score', score: '0.91' }
        ];
        
        const tableBody = document.querySelector('#ml tbody');
        tableBody.innerHTML = '';
        
        performanceData.forEach(row => {
            tableBody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${row.metric}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${row.score}</td>
                </tr>
            `;
        });
    }
    
    // Initial update
    updateModelPerformance();
}

// ======================
// HYPOTHESIS TESTING SECTION
// ======================
function initializeHypothesisTesting() {
    // Dataset selector
    const datasetSelect = document.getElementById('dataset-select-hypothesis');
    updateDatasetSelect(datasetSelect, true);
    
    // Variable selectors
    const variable1Select = document.getElementById('variable-1');
    const variable2Select = document.getElementById('variable-2');
    ['PurchaseAmount', 'CustomerSegment', 'Region', 'ProductCategory'].forEach(col => {
        const option1 = document.createElement('option');
        option1.value = col.toLowerCase();
        option1.textContent = col;
        variable1Select.appendChild(option1.cloneNode(true));
        
        const option2 = document.createElement('option');
        option2.value = col.toLowerCase();
        option2.textContent = col;
        variable2Select.appendChild(option2);
    });
    
    // Run test button
    document.querySelector('#hypothesis button')?.addEventListener('click', () => {
        const selectedDataset = datasetSelect.value;
        const testType = document.getElementById('test-type').value;
        const variable1 = variable1Select.value;
        const variable2 = variable2Select.value;
        
        showNotification(`Running ${testType} test between ${variable1} and ${variable2}...`);
        
        setTimeout(() => {
            showNotification(`${testType} test completed successfully!`);
            updateTestResults();
        }, 1500);
    });
    
    // Update test results
    function updateTestResults() {
        const resultsContainer = document.querySelector('#hypothesis .bg-gray-50');
        resultsContainer.innerHTML = `
            <p class="text-sm text-gray-700 dark:text-gray-300"><b>Test Performed:</b> Independent T-test</p>
            <p class="text-sm text-gray-700 dark:text-gray-300"><b>Variables:</b> 'PurchaseAmount' vs 'CustomerSegment'</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 mt-2"><b>T-statistic:</b> 2.54</p>
            <p class="text-sm text-gray-700 dark:text-gray-300"><b>P-value:</b> 0.012</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 mt-2"><b>Conclusion:</b> With a p-value of 0.012 (less than 0.05), we reject the null hypothesis. There is a statistically significant difference in purchase amounts between customer segments.</p>
        `;
    }
    
    // Initial update
    updateTestResults();
}

// ======================
// VISUALIZATION SECTION
// ======================
function initializeVisualization() {
    // Dataset selector
    const datasetSelect = document.getElementById('dataset-select-viz');
    updateDatasetSelect(datasetSelect, true);
    
    // Axis selectors
    const xAxisSelect = document.getElementById('x-axis');
    const yAxisSelect = document.getElementById('y-axis');
    ['Month', 'Revenue', 'Quantity', 'Region'].forEach(col => {
        const optionX = document.createElement('option');
        optionX.value = col.toLowerCase();
        optionX.textContent = col;
        xAxisSelect.appendChild(optionX.cloneNode(true));
        
        const optionY = document.createElement('option');
        optionY.value = col.toLowerCase();
        optionY.textContent = col;
        yAxisSelect.appendChild(optionY);
    });
    
    // Generate chart button
    document.querySelector('#visualization button')?.addEventListener('click', () => {
        const selectedDataset = datasetSelect.value;
        const chartType = document.getElementById('chart-type').value;
        const xAxis = xAxisSelect.value;
        const yAxis = yAxisSelect.value;
        
        showNotification(`Generating ${chartType} for ${xAxis} vs ${yAxis}...`);
        
        setTimeout(() => {
            showNotification('Chart generated successfully!');
            updateChartDisplay(chartType);
            
            // Save visualization
            const visualizations = JSON.parse(localStorage.getItem('visualizations')) || [];
            visualizations.push({
                id: Date.now(),
                name: `${chartType} of ${xAxis} vs ${yAxis}`,
                type: chartType,
                date: new Date().toLocaleString(),
                owner: JSON.parse(localStorage.getItem('currentUser')).id
            });
            localStorage.setItem('visualizations', JSON.stringify(visualizations));
            updateDashboardStats();
        }, 1000);
    });
    
    // Update chart display
    function updateChartDisplay(chartType) {
        const chartContainer = document.querySelector('#visualization .chart-container');
        chartContainer.innerHTML = `
            <canvas id="myChart" class="w-full h-full"></canvas>
        `;
        
        // Simple placeholder for demonstration
        const canvas = document.getElementById('myChart');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = chartContainer.offsetWidth;
        canvas.height = chartContainer.offsetHeight;
        
        // Draw placeholder
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#1e293b' : '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#4f46e5';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${chartType} Placeholder`, canvas.width/2, canvas.height/2);
    }
    
    // Initial update
    updateChartDisplay('Bar Chart');
}

// ======================
// PROFILE SECTION
// ======================
function initializeProfile() {
    // Profile picture upload
    const profilePictureUpload = document.getElementById('profile-picture-upload');
    const profilePicture = document.getElementById('profile-picture');
    
    profilePictureUpload?.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // Update profile picture in UI
                const profileImgContainer = document.getElementById('profile-img-container');
                profileImgContainer.innerHTML = `
                    <img src="${event.target.result}" 
                         alt="Profile" 
                         class="w-full h-full object-cover rounded-full">
                `;
                
                // Update in local storage
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    currentUser.profilePicture = event.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileRole = document.getElementById('profile-role');
    const profileBio = document.getElementById('profile-bio');
    
    let isEditing = false;
    let originalValues = {};
    
    editProfileBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!isEditing) {
            // Enter edit mode
            originalValues = {
                username: profileUsername.textContent,
                email: profileEmail.textContent,
                role: profileRole.textContent,
                bio: profileBio.textContent
            };
            
            profileUsername.innerHTML = `<input type="text" value="${originalValues.username}" class="w-full bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 dark:text-white">`;
            profileEmail.innerHTML = `<input type="email" value="${originalValues.email}" class="w-full bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 dark:text-white">`;
            profileRole.innerHTML = `<input type="text" value="${originalValues.role}" class="w-full bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 dark:text-white">`;
            profileBio.innerHTML = `<textarea class="w-full bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 h-20 dark:text-white">${originalValues.bio}</textarea>`;
            
            editProfileBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Profile';
            editProfileBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            editProfileBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            isEditing = true;
        } else {
            // Save changes
            const newUsername = profileUsername.querySelector('input').value;
            const newEmail = profileEmail.querySelector('input').value;
            const newRole = profileRole.querySelector('input').value;
            const newBio = profileBio.querySelector('textarea').value;
            
            // Update UI
            profileUsername.textContent = newUsername;
            profileEmail.textContent = newEmail;
            profileRole.textContent = newRole;
            profileBio.textContent = newBio;
            
            // Update sidebar
            document.getElementById('username-display').textContent = newUsername;
            document.getElementById('user-role-display').textContent = newRole;
            
            // Update local storage
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                currentUser.name = newUsername;
                currentUser.email = newEmail;
                currentUser.role = newRole;
                currentUser.bio = newBio;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            // Reset button
            editProfileBtn.innerHTML = '<i class="fas fa-edit mr-2"></i>Edit Profile';
            editProfileBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            editProfileBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            isEditing = false;
            
            showNotification('Profile updated successfully!');
        }
    });
}

// ======================
// SETTINGS SECTION
// ======================
function initializeSettings() {
    // Settings form submission
    const settingsForm = document.querySelector('.settings-form');
    
    settingsForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const appName = document.getElementById('app-name').value;
        const theme = document.querySelector('input[name="theme"]:checked').value;
        const notificationEmail = document.getElementById('notification-email').value;
        const dataRetention = document.getElementById('data-retention').value;
        const twoFactorEnabled = document.querySelector('input[type="checkbox"]').checked;
        
        // Save settings
        const settings = {
            appName,
            theme,
            notificationEmail,
            dataRetention,
            twoFactorEnabled,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('appSettings', JSON.stringify(settings));
        
        // Apply theme immediately
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'dark');
        } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'light');
        } else {
            // System preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'light');
            }
        }
        
        showNotification('Settings saved successfully!');
    });
    
    // Load saved settings
    const savedSettings = JSON.parse(localStorage.getItem('appSettings'));
    if (savedSettings) {
        document.getElementById('app-name').value = savedSettings.appName || 'DataVista';
        document.querySelector(`input[name="theme"][value="${savedSettings.theme || 'light'}"]`).checked = true;
        document.getElementById('notification-email').value = savedSettings.notificationEmail || '';
        document.getElementById('data-retention').value = savedSettings.dataRetention || '90';
        document.querySelector('input[type="checkbox"]').checked = savedSettings.twoFactorEnabled || false;
    }
}

// ======================
// MAIN INITIALIZATION
// ======================
function initializeAllFeatures() {
    // Initialize all sections
    initializeDashboard();
    initializeDataLoading();
    initializeDataCleaning();
    initializePreprocessing();
    initializeStatistics();
    initializeMachineLearning();
    initializeHypothesisTesting();
    initializeVisualization();
    initializeProfile();
    initializeSettings();
    
    // Tab switching functionality
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            
            // Update active tab link
            tabLinks.forEach(tab => {
                tab.classList.remove('bg-indigo-50', 'text-indigo-700', 'dark:bg-indigo-900/30', 'dark:text-indigo-300');
                tab.classList.add('text-gray-700', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-700');
            });
            
            link.classList.add('bg-indigo-50', 'text-indigo-700', 'dark:bg-indigo-900/30', 'dark:text-indigo-300');
            link.classList.remove('text-gray-700', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-700');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(tabId).classList.add('active');
            
            // Update page title
            document.getElementById('page-title').textContent = link.textContent.trim();
        });
    });
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
}