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
        
        // Get menu items for sweeping hover effect
        this.menuItems = this.container.querySelector('.pin-menu-items');
        this.pinItems = this.container.querySelectorAll('.pin-item');
        
        // Add event listeners
        this.container.addEventListener('mouseenter', () => this.handleMouseEnter());
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.toggle.addEventListener('click', (e) => this.handleToggleClick(e));
        
        // Add keyboard support
        this.toggle.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Add sweeping hover effect
        this.initSweepingHover();
        
        console.log('Pin menu initialized');
    }
    
    initSweepingHover() {
        this.pinItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                this.setSweepPosition(index);
            });
            
            item.addEventListener('mouseleave', () => {
                this.clearSweepPosition();
            });
        });
    }
    
    setSweepPosition(index) {
        if (this.menuItems) {
            this.menuItems.setAttribute('data-hover', index.toString());
        }
    }
    
    clearSweepPosition() {
        if (this.menuItems) {
            this.menuItems.removeAttribute('data-hover');
        }
    }
    
    handleMouseEnter() {
        clearTimeout(this.collapseTimeout);
        this.expandTimeout = setTimeout(() => {
            this.expand();
        }, 50); // Faster expansion trigger
    }
    
    handleMouseLeave() {
        clearTimeout(this.expandTimeout);
        this.collapseTimeout = setTimeout(() => {
            this.collapse();
        }, 100); // Snappier collapse
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