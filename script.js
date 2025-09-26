document.addEventListener('DOMContentLoaded', function() {
    // Real-time validation
    function validateField(field) {
        const wrapper = field.closest('.input-wrapper');
        if (!wrapper) return;

        const validationIcon = wrapper.querySelector('.validation-icon');
        const validationMessage = wrapper.querySelector('.validation-message');
        const fieldType = field.type;
        const fieldValue = field.value.trim();

        let isValid = true;
        let message = '';

        // Check if field is required and empty
        if (field.hasAttribute('required') && fieldValue === '') {
            isValid = false;
            message = 'This field is required';
        }
        // Email validation
        else if (fieldType === 'email' && fieldValue !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(fieldValue)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }
        // Name validation (at least 2 characters)
        else if (field.id === 'name' && fieldValue !== '') {
            if (fieldValue.length < 2) {
                isValid = false;
                message = 'Name must be at least 2 characters long';
            }
        }
        // Message validation (at least 10 characters)
        else if (field.id === 'message' && fieldValue !== '') {
            if (fieldValue.length < 10) {
                isValid = false;
                message = 'Please provide more details (at least 10 characters)';
            }
        }

        // Update validation UI
        if (fieldValue === '') {
            // Empty field - neutral state
            validationIcon.className = 'validation-icon';
            validationMessage.className = 'validation-message';
            validationMessage.textContent = '';
        } else if (isValid) {
            // Valid field
            validationIcon.className = 'validation-icon valid';
            validationIcon.textContent = '✓';
            validationMessage.className = 'validation-message';
            validationMessage.textContent = '';
        } else {
            // Invalid field
            validationIcon.className = 'validation-icon invalid';
            validationIcon.textContent = '!';
            validationMessage.className = 'validation-message show';
            validationMessage.textContent = message;
        }
    }

    // Add validation to all form fields
    const formFields = document.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        // Validate on input (real-time)
        field.addEventListener('input', () => validateField(field));

        // Validate on blur (when leaving field)
        field.addEventListener('blur', () => validateField(field));
    });

    // Form submission handling
    const form = document.querySelector('form');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'block';

        // Simulate processing time (2 seconds)
        setTimeout(() => {
            // Hide form and show confirmation
            form.style.opacity = '0';
            setTimeout(() => {
                form.style.display = 'none';
                confirmationMessage.style.display = 'block';
                setTimeout(() => {
                    confirmationMessage.style.opacity = '1';
                }, 10);
            }, 300);
        }, 2000);
    });

    // Custom dropdown functionality
    const originalSelect = document.getElementById('position');
    const customDropdown = document.getElementById('customDropdown');
    const dropdownSelected = document.getElementById('dropdownSelected');
    const dropdownOptions = document.getElementById('dropdownOptions');
    const dropdownIcon = document.querySelector('.dropdown-icon');

    // Populate custom dropdown with options from original select
    const options = originalSelect.querySelectorAll('option');
    options.forEach((option, index) => {
        if (index === 0) {
            // Set placeholder text from first option
            dropdownSelected.textContent = option.textContent;
            dropdownSelected.classList.add('placeholder');
        } else {
            // Create custom option
            const customOption = document.createElement('div');
            customOption.classList.add('dropdown-option');
            customOption.textContent = option.textContent;
            customOption.dataset.value = option.value;
            dropdownOptions.appendChild(customOption);
        }
    });

    // Toggle dropdown
    function toggleDropdown() {
        const isOpen = customDropdown.classList.contains('open');
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    function openDropdown() {
        customDropdown.classList.add('open');
    }

    function closeDropdown() {
        customDropdown.classList.remove('open');
    }

    // Handle dropdown click
    dropdownSelected.addEventListener('click', toggleDropdown);

    // Handle option selection
    dropdownOptions.addEventListener('click', function(e) {
        if (e.target.classList.contains('dropdown-option')) {
            const selectedValue = e.target.dataset.value;
            const selectedText = e.target.textContent;

            // Update custom dropdown display
            dropdownSelected.textContent = selectedText;
            dropdownSelected.classList.remove('placeholder');

            // Update original select value
            originalSelect.value = selectedValue;

            // Update active option
            document.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            e.target.classList.add('selected');

            // Close dropdown
            closeDropdown();

            // Trigger change event on original select for validation
            const changeEvent = new Event('change', { bubbles: true });
            originalSelect.dispatchEvent(changeEvent);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!customDropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    // Keyboard navigation
    dropdownSelected.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown();
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });

    // Handle arrow key navigation within options
    dropdownOptions.addEventListener('keydown', function(e) {
        const options = Array.from(dropdownOptions.querySelectorAll('.dropdown-option'));
        const currentFocus = document.activeElement;
        const currentIndex = options.indexOf(currentFocus);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % options.length;
            options[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
            options[prevIndex].focus();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus && currentFocus.classList.contains('dropdown-option')) {
                currentFocus.click();
            }
        } else if (e.key === 'Escape') {
            closeDropdown();
            dropdownSelected.focus();
        }
    });
});