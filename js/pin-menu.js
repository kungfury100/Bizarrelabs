/**
 * Pin Menu Component
 * Handles the expandable pin menu functionality
 */

class PinMenu {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
        this.toggle = this.container.querySelector('.pin-toggle');
        this.isExpanded = false;
        this.expandTimeout = null;
        this.collapseTimeout = null;
        
        this.init();
    }
    
    init() {
        if (!this.container || !this.toggle) {
            console.warn('Pin menu elements not found');
            return;
        }
        
        // Add event listeners
        this.container.addEventListener('mouseenter', () => this.handleMouseEnter());
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.toggle.addEventListener('click', (e) => this.handleToggleClick(e));
        
        // Add keyboard support
        this.toggle.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        console.log('Pin menu initialized');
    }
    
    handleMouseEnter() {
        clearTimeout(this.collapseTimeout);
        this.expandTimeout = setTimeout(() => {
            this.expand();
        }, 100); // Small delay to prevent accidental triggers
    }
    
    handleMouseLeave() {
        clearTimeout(this.expandTimeout);
        this.collapseTimeout = setTimeout(() => {
            this.collapse();
        }, 200); // Slightly longer delay for better UX
    }
    
    handleToggleClick(e) {
        e.preventDefault();
        this.isExpanded ? this.collapse() : this.expand();
    }
    
    handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleToggleClick(e);
        }
        if (e.key === 'Escape' && this.isExpanded) {
            this.collapse();
        }
    }
    
    expand() {
        if (this.isExpanded) return;
        
        this.container.classList.add('expanded');
        this.toggle.setAttribute('aria-expanded', 'true');
        this.isExpanded = true;
        
        // Add tabindex to menu items for keyboard navigation
        const menuItems = this.container.querySelectorAll('.pin-link:not(.pin-toggle)');
        menuItems.forEach(item => {
            item.setAttribute('tabindex', '0');
        });
    }
    
    collapse() {
        if (!this.isExpanded) return;
        
        this.container.classList.remove('expanded');
        this.toggle.setAttribute('aria-expanded', 'false');
        this.isExpanded = false;
        
        // Remove tabindex from menu items
        const menuItems = this.container.querySelectorAll('.pin-link:not(.pin-toggle)');
        menuItems.forEach(item => {
            item.removeAttribute('tabindex');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PinMenu('pinMenu');
});