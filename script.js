document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;

            // Remove active class from all links and contents
            tabLinks.forEach(item => {
                item.classList.remove('bg-indigo-50', 'text-indigo-700', 'dark:bg-indigo-900/30', 'dark:text-indigo-300');
                item.classList.add('text-gray-700', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-700');
            });
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked link and corresponding content
            link.classList.add('bg-indigo-50', 'text-indigo-700', 'dark:bg-indigo-900/30', 'dark:text-indigo-300');
            link.classList.remove('text-gray-700', 'hover:bg-gray-100', 'dark:text-gray-300', 'dark:hover:bg-gray-700');
            document.getElementById(tabId).classList.add('active');

            // Update page title
            pageTitle.textContent = link.textContent.trim();
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const htmlElement = document.documentElement;

    darkModeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        // Store user preference in localStorage
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Apply saved theme on load
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // Data Loading tab switching
    const uploadTabButtons = document.querySelectorAll('.upload-tab-btn');
    const uploadTabContents = document.querySelectorAll('.upload-tab-content');

    uploadTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.uploadTab;

            // Remove active classes
            uploadTabButtons.forEach(btn => {
                btn.classList.remove('text-indigo-700', 'border-b-2', 'border-indigo-600', 'dark:text-indigo-400', 'dark:border-indigo-400');
                btn.classList.add('text-gray-600', 'hover:text-indigo-700', 'dark:text-gray-400', 'dark:hover:text-indigo-400');
            });
            uploadTabContents.forEach(content => content.classList.add('hidden'));

            // Add active classes
            button.classList.add('text-indigo-700', 'border-b-2', 'border-indigo-600', 'dark:text-indigo-400', 'dark:border-indigo-400');
            button.classList.remove('text-gray-600', 'hover:text-indigo-700', 'dark:text-gray-400', 'dark:hover:text-indigo-400');
            document.getElementById(`upload-tab-${tabId}`).classList.remove('hidden');
        });
    });

    // Simulate file upload progress
    const uploadButton = document.querySelector('#upload-tab-local button');
    const uploadProgress = document.getElementById('upload-progress');
    const uploadProgressBar = document.getElementById('upload-progress-bar');
    const uploadProgressPercent = document.getElementById('upload-progress-percent');

    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            uploadProgress.classList.remove('hidden');
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    uploadProgress.classList.add('hidden');
                    alert('File uploaded successfully!');
                    uploadProgressBar.style.width = '0%';
                    uploadProgressPercent.textContent = '0%';
                } else {
                    width += 10;
                    uploadProgressBar.style.width = width + '%';
                    uploadProgressPercent.textContent = width + '%';
                }
            }, 100);
        });
    }

    // Profile picture upload functionality
    const profilePictureUpload = document.getElementById('profile-picture-upload');
    const profilePicture = document.getElementById('profile-picture');
    const profileImgContainer = document.getElementById('profile-img-container');
    const profileIcon = document.getElementById('profile-icon'); // The Font Awesome icon

    if (profilePictureUpload) {
        profilePictureUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicture.src = e.target.result;
                    profilePicture.classList.add('profile-img'); // Apply styling for uploaded image
                    profileImgContainer.innerHTML = ''; // Clear icon
                    profileImgContainer.appendChild(profilePicture); // Append image
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Simulate profile edit and save
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileRole = document.getElementById('profile-role');
    const profileBio = document.getElementById('profile-bio');
    const usernameDisplay = document.getElementById('username-display'); // Sidebar username
    const userRoleDisplay = document.getElementById('user-role-display'); // Sidebar role

    let isEditingProfile = false;
    let originalProfileData = {};

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            if (!isEditingProfile) {
                // Enter edit mode
                originalProfileData = {
                    username: profileUsername.textContent,
                    email: profileEmail.textContent,
                    role: profileRole.textContent,
                    bio: profileBio.textContent
                };

                profileUsername.innerHTML = `<input type="text" value="${originalProfileData.username}" class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1">`;
                profileEmail.innerHTML = `<input type="email" value="${originalProfileData.email}" class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1">`;
                profileRole.innerHTML = `<input type="text" value="${originalProfileData.role}" class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1">`;
                profileBio.innerHTML = `<textarea class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 h-20">${originalProfileData.bio}</textarea>`;

                editProfileBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Profile';
                editProfileBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                editProfileBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                isEditingProfile = true;
            } else {
                // Save changes
                const newUsername = profileUsername.querySelector('input').value;
                const newEmail = profileEmail.querySelector('input').value;
                const newRole = profileRole.querySelector('input').value;
                const newBio = profileBio.querySelector('textarea').value;

                profileUsername.textContent = newUsername;
                profileEmail.textContent = newEmail;
                profileRole.textContent = newRole;
                profileBio.textContent = newBio;

                usernameDisplay.textContent = newUsername;
                userRoleDisplay.textContent = newRole;

                editProfileBtn.innerHTML = '<i class="fas fa-edit mr-2"></i>Edit Profile';
                editProfileBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                editProfileBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
                isEditingProfile = false;
                alert('Profile updated successfully!');
            }
        });
    }

    // Simulate logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Logged out successfully!');
            // Here you would typically clear session, redirect to login page, etc.
        });
    }

    // Dummy Chart.js integration (you'd initialize actual charts here)
    // For demonstration, a placeholder canvas exists in visualization tab.
    // In a real application, you'd load Chart.js and render dynamic charts.
    const chartContext = document.getElementById('myChart');
    if (chartContext) {
        // Example of how you might initialize a chart (requires Chart.js library)
        // const myChart = new Chart(chartContext, {
        //     type: 'bar',
        //     data: {
        //         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        //         datasets: [{
        //             label: '# of Votes',
        //             data: [12, 19, 3, 5, 2, 3],
        //             backgroundColor: [
        //                 'rgba(255, 99, 132, 0.2)',
        //                 'rgba(54, 162, 235, 0.2)',
        //                 'rgba(255, 206, 86, 0.2)',
        //                 'rgba(75, 192, 192, 0.2)',
        //                 'rgba(153, 102, 255, 0.2)',
        //                 'rgba(255, 159, 64, 0.2)'
        //             ],
        //             borderColor: [
        //                 'rgba(255, 99, 132, 1)',
        //                 'rgba(54, 162, 235, 1)',
        //                 'rgba(255, 206, 86, 1)',
        //                 'rgba(75, 192, 192, 1)',
        //                 'rgba(153, 102, 255, 1)',
        //                 'rgba(255, 159, 64, 1)'
        //             ],
        //             borderWidth: 1
        //         }]
        //     },
        //     options: {
        //         responsive: true,
        //         maintainAspectRatio: false,
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // });
    }
});