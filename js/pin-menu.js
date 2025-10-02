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
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.justExpanded = false;
        
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
        
        // Add event listeners based on device type
        if (!this.isTouchDevice) {
            // Desktop: use hover events
            this.container.addEventListener('mouseenter', () => this.handleMouseEnter());
            this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        } else {
            // Mobile: use touch events
            this.toggle.addEventListener('touchstart', (e) => this.handleToggleTouchStart(e), { passive: false });
        }
        
        this.toggle.addEventListener('click', (e) => this.handleToggleClick(e));
        
        // Add keyboard support
        this.toggle.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Add sweeping hover effect
        this.initSweepingHover();
        
        console.log('Pin menu initialized');
    }
    
    initSweepingHover() {
        this.pinItems.forEach((item, index) => {
            // Mouse events for desktop
            if (!this.isTouchDevice) {
                item.addEventListener('mouseenter', () => {
                    this.setSweepPosition(index);
                });
                
                item.addEventListener('mouseleave', () => {
                    this.clearSweepPosition();
                });
            }
            
            // Touch events for mobile
            if (this.isTouchDevice) {
                item.addEventListener('touchstart', (e) => {
                    this.handleTouchStart(e, index);
                }, { passive: false });
                
                item.addEventListener('click', (e) => {
                    this.handlePinItemClick(e, item);
                });
            }
        });
        
        // Handle clicks outside menu to collapse on mobile
        if (this.isTouchDevice) {
            document.addEventListener('touchstart', (e) => {
                if (!this.container.contains(e.target) && this.isExpanded) {
                    this.collapse();
                }
            });
        }
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
    
    handleTouchStart(e, index) {
        if (!this.isExpanded) {
            // First touch - expand menu and prevent link activation
            e.preventDefault();
            this.expand();
            this.setSweepPosition(index);
            this.justExpanded = true;
            
            // Reset justExpanded flag after a short delay
            setTimeout(() => {
                this.justExpanded = false;
            }, 300);
        } else {
            // Menu is already expanded, allow normal touch behavior
            this.setSweepPosition(index);
        }
    }
    
    handlePinItemClick(e, item) {
        if (this.isTouchDevice && this.justExpanded) {
            // Prevent link activation immediately after expansion
            e.preventDefault();
            return false;
        }
        
        if (this.isTouchDevice && !this.isExpanded) {
            // Expand menu on first click
            e.preventDefault();
            this.expand();
            return false;
        }
        
        // Allow normal link behavior (menu is expanded and not just expanded)
        return true;
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
    
    handleToggleTouchStart(e) {
        if (this.isTouchDevice) {
            e.preventDefault();
            if (!this.isExpanded) {
                this.expand();
                this.justExpanded = true;
                setTimeout(() => {
                    this.justExpanded = false;
                }, 300);
            } else {
                this.collapse();
            }
        }
    }
    
    handleToggleClick(e) {
        if (this.isTouchDevice && this.justExpanded) {
            e.preventDefault();
            return;
        }
        
        if (!this.isTouchDevice) {
            e.preventDefault();
            this.isExpanded ? this.collapse() : this.expand();
        }
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