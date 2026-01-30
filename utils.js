// Utility Functions for Analysis Pages

/**
 * Download dataset file
 * @param {string} filename - Name of the file to download
 */
function downloadDataset(filename) {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = filename;
    link.download = filename;
    link.style.display = 'none';
    
    // Add to DOM and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Remove from DOM
    document.body.removeChild(link);
    
    // Show notification
    showNotification(`Downloading ${filename}...`);
}

/**
 * Show temporary notification
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate percentage
 * @param {number} value - The value
 * @param {number} total - The total
 * @returns {string} Percentage as string
 */
function getPercentage(value, total) {
    const percentage = ((value / total) * 100).toFixed(2);
    return `${percentage}%`;
}

/**
 * Animate counter from 0 to target value
 * @param {HTMLElement} element - Element to update
 * @param {number} target - Target value
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toFixed(2);
            clearInterval(counter);
        } else {
            element.textContent = current.toFixed(2);
        }
    }, 16);
}

/**
 * Create chart-like visualization using HTML/CSS
 * @param {string} containerId - ID of container element
 * @param {Array} data - Array of {label, value} objects
 */
function createBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const maxValue = Math.max(...data.map(d => d.value));
    
    const html = data.map(item => `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-weight: bold;">${item.label}</span>
                <span>${item.value}</span>
            </div>
            <div style="
                height: 20px;
                background: #e0e0e0;
                border-radius: 10px;
                overflow: hidden;
            ">
                <div style="
                    height: 100%;
                    width: ${(item.value / maxValue) * 100}%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    transition: width 0.3s ease;
                "></div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

/**
 * Toggle detailed information
 * @param {HTMLElement} element - Element to toggle
 */
function toggleDetails(element) {
    element.classList.toggle('expanded');
    
    const content = element.nextElementSibling;
    if (content) {
        if (element.classList.contains('expanded')) {
            content.style.display = 'block';
            content.style.animation = 'fadeIn 0.3s ease';
        } else {
            content.style.display = 'none';
        }
    }
}

/**
 * Create a sortable table
 * @param {string} tableId - ID of table element
 */
function makeSortable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            sortTable(table, index);
        });
    });
}

/**
 * Sort table by column
 * @param {HTMLElement} table - Table element
 * @param {number} columnIndex - Column index to sort by
 */
function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent.trim();
        const bVal = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as number
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }
        
        return aVal.localeCompare(bVal);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Export table to CSV
 * @param {string} tableId - ID of table element
 * @param {string} filename - Output filename
 */
function exportTableToCSV(tableId, filename = 'data.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    
    // Add headers
    const headers = table.querySelectorAll('th');
    csv.push(Array.from(headers).map(h => h.textContent).join(','));
    
    // Add rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        csv.push(Array.from(cells).map(c => c.textContent).join(','));
    });
    
    // Create and download file
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    showNotification(`Exported to ${filename}`);
}

/**
 * Calculate statistics from an array
 * @param {Array<number>} data - Array of numbers
 * @returns {Object} Statistics object
 */
function calculateStats(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    
    return {
        count: n,
        sum: sum,
        mean: mean,
        median: sorted[Math.floor(n / 2)],
        min: Math.min(...data),
        max: Math.max(...data),
        range: Math.max(...data) - Math.min(...data),
        stdDev: Math.sqrt(variance),
        variance: variance
    };
}

/**
 * Highlight search term in text
 * @param {string} text - Text to search in
 * @param {string} term - Search term
 * @returns {string} HTML with highlighted term
 */
function highlightText(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Create a data comparison widget
 * @param {string} containerId - ID of container
 * @param {Object} dataset1 - First dataset stats
 * @param {Object} dataset2 - Second dataset stats
 */
function createComparison(containerId, dataset1, dataset2) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const html = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <h3 style="color: #667eea; margin-bottom: 15px;">${dataset1.name}</h3>
                ${Object.entries(dataset1.stats).map(([key, value]) => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="font-weight: bold;">${key}:</span>
                        <span>${typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                `).join('')}
            </div>
            <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #9c27b0;">
                <h3 style="color: #9c27b0; margin-bottom: 15px;">${dataset2.name}</h3>
                ${Object.entries(dataset2.stats).map(([key, value]) => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                        <span style="font-weight: bold;">${key}:</span>
                        <span>${typeof value === 'number' ? value.toFixed(2) : value}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Add keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S to save/print
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            window.print();
        }
        
        // Ctrl/Cmd + F to focus search (if available)
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            const searchBox = document.querySelector('[data-search]');
            if (searchBox) {
                e.preventDefault();
                searchBox.focus();
            }
        }
    });
}

/**
 * Initialize page animations on scroll
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// Add CSS animations if not already present
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    mark {
        background: #fff9e6;
        padding: 2px 4px;
        border-radius: 2px;
    }
`;
document.head.appendChild(style);

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        downloadDataset,
        showNotification,
        formatNumber,
        getPercentage,
        animateCounter,
        createBarChart,
        toggleDetails,
        makeSortable,
        sortTable,
        exportTableToCSV,
        calculateStats,
        highlightText,
        createComparison,
        initKeyboardShortcuts,
        initScrollAnimations
    };
}
