// Contact form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Send form data to API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success message
                showNotification('success', 'Success! We received your enquiry. Check your email for confirmation.');
                contactForm.reset();

                // Scroll to notification
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Show error message
                showNotification('error', result.error || 'Failed to send enquiry. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('error', 'Network error. Please check your connection and try again.');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

// Show notification message
function showNotification(type, message) {
    // Remove existing notification
    const existing = document.querySelector('.form-notification');
    if (existing) {
        existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification form-notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : '✕'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" type="button" aria-label="Close notification">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;

    // Insert at top of page
    document.body.insertBefore(notification, document.body.firstChild);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}
