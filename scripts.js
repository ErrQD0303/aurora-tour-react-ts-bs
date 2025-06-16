"use strict";

/* NAVBAR */

const navbarElements = {
  navbarToggler: document.querySelectorAll(".navbar-toggler"),
};

const navbarUtilities = {
  setNavbarTogglerLoadingState: (navbarToggler, isLoading) => {
    if (isLoading) {
      navbarToggler.classList.add("collapsing");
      navbarToggler.setAttribute("aria-busy", "true");
    } else {
      navbarToggler.classList.remove("collapsing");
      navbarToggler.removeAttribute("aria-busy");
    }
  },

  runTogglerLoadingState: async (toggler) => {
    navbarUtilities.setNavbarTogglerLoadingState(toggler, true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    navbarUtilities.setNavbarTogglerLoadingState(toggler, false);
  },

  collapseNavbar: (navbar) => {
    navbar.style.height = "0rem";
  },

  expandNavbar: (navbar, height) => {
    navbar.style.height = `${height}rem`;
  },

  runNavbarCollapseTransition: (navbar) => {
    const height = navbar.scrollHeight / 10;
    navbar.style.height = `${height}rem`;
    navbar.style.display = "block"; // Ensure the navbar is visible during transition

    // Ensure the navbar is in a expanded state before expanding, this is preventing the css problem in your css file, help you to avoid any css issues you may have when you set the wrong height in the css file
    navbar.offsetHeight; // Trigger reflow
    navbar.classList.remove("collapse", "show");
    navbar.classList.add("collapsing");

    // This function will be called after the transition you added to this function before the next rendering cycle
    requestAnimationFrame(() => navbarUtilities.collapseNavbar(navbar));

    navbar.addEventListener(
      "transitionend",
      (e) => navbarHandlers.togglerTransitionEnd(e, []),
      { once: true }
    );

    navbar.setAttribute("aria-expanded", "false");
  },

  runNavbarExpandTransition: (navbar) => {
    navbar.classList.add("show", "collapsing");
    // Ensure the navbar is in a collapsed state before expanding, this is preventing the css problem in your css file, help you to avoid any css issues you may have when you set the wrong height in the css file
    navbar.style.height = "0rem";
    navbar.style.display = "block";
    navbar.offsetHeight; // Trigger reflow, make sure the height is set to 0 before expanding

    const height = navbar.scrollHeight / 10;

    // This function will be called after the transition you added to this function before the next rendering cycle
    requestAnimationFrame(() => navbarUtilities.expandNavbar(navbar, height));

    navbar.addEventListener(
      "transitionend",
      (e) => navbarHandlers.togglerTransitionEnd(e, ["show"]),
      { once: true }
    );

    navbar.setAttribute("aria-expanded", "true");
  },
};

const navbarHandlers = {
  onToggleClick: async (e) => {
    const toggler = e.currentTarget;
    const targetId = toggler.getAttribute("data-target");
    const targetElement = document.querySelector(targetId);

    if (!targetElement) {
      console.error(`Target element with ID ${targetId} not found.`);
      return;
    }

    const isShown = targetElement.classList.contains("show");

    await navbarUtilities.runTogglerLoadingState(targetElement);

    if (isShown) {
      navbarUtilities.runNavbarCollapseTransition(targetElement);
    } else {
      navbarUtilities.runNavbarExpandTransition(targetElement);
    }
  },

  togglerTransitionEnd: (e, additionalClasses = []) => {
    const targetElement = e.currentTarget;

    targetElement.classList.remove("collapsing");
    targetElement.classList.add("collapse", ...additionalClasses);
    targetElement.style.height = "";

    if (!additionalClasses.includes("show")) {
      // Collapsing: hide it after transition
      targetElement.style.display = "none";
    }
  },
};

/* HERO CAROUSEL */
const carouselElements = {
  carousels: document.querySelectorAll(".carousel"),
  heroCarousel: document.querySelector("#hero-carousel"),
  nextButtons: document.querySelectorAll(".carousel-control-next"),
  prevButtons: document.querySelectorAll(".carousel-control-prev"),
};

const carouselUtilities = {
  gotoSlide: async ({ elements, variables }, nextIndex, direction = "next") => {
    if (variables.isSliding || nextIndex === variables.activeIndex) {
      return false; // Prevent action if already sliding or same slide
    }

    let slidesToTake = 0;
    if (direction === "next") {
      slidesToTake =
        (nextIndex - variables.activeIndex + elements.carouselItems.length) %
        elements.carouselItems.length; // Calculate the number of slides to take forward, no matter if the nextIndex is less than the activeIndex or not
    } else {
      slidesToTake =
        (variables.activeIndex - nextIndex + elements.carouselItems.length) %
        elements.carouselItems.length; // Calculate the number of slides to take backward, no matter if the nextIndex is greater than the activeIndex or not
    }

    for (let i = 0; i < slidesToTake; i++) {
      variables.isSliding = true;
      const currentIdx = variables.activeIndex; // Get the current active index before changing it
      const current = elements.carouselItems[currentIdx];
      const nextIndex =
        (direction === "next"
          ? currentIdx + 1
          : currentIdx - 1 + elements.carouselItems.length) %
        elements.carouselItems.length;
      const next = elements.carouselItems[nextIndex];

      await carouselUtilities.animateSingleSlide(
        current,
        next,
        direction,
        nextIndex,
        elements,
        variables
      );
    }

    clearInterval(variables.autoplayInterval); // Clear the autoplay interval if it exists
    variables.autoplayInterval = carouselUtilities.addAutoPlay({
      elements,
      variables,
      carousel: elements.carouselItems[0],
    }); // Restart autoplay if enabled

    return true; // Indicate that the slide transition was initiated successfully
  },

  setActiveIndicator: ({ elements, variables }, nextIdx) => {
    elements.indicators.querySelectorAll("button").forEach((btn, index) => {
      btn.classList.toggle("active", index === nextIdx);
      btn.setAttribute("aria-current", index === nextIdx ? "true" : "false");
    });
  },

  animateSingleSlide: async (
    current,
    next,
    direction,
    nextIndex,
    elements,
    variables
  ) => {
    return new Promise((resolve) => {
      // Disable transition for immediate repositioning of 'next' slide
      next.style.transition = "transform 0s ease-in-out";

      // Define the next slide position
      next.classList.add(
        direction === "next" ? "carousel-item-next" : "carousel-item-prev",
        "carousel-item-show"
      );

      // Force reflow: Trigger reflow to apply the immediate positioning classes
      // before the transition is re-enabled. This ensures the browser
      // renders the element in its new position *without* a transition.
      next.offsetHeight;

      // Re-enable transition for the next slide's movement
      next.style.transition = "";

      // Reposition the current slide to move out of view
      current.classList.add(
        direction === "next" ? "carousel-item-start" : "carousel-item-end"
      );

      // Reposition the next slide to move into the center
      next.classList.add("carousel-item-center");

      // Attach the transitionend listener
      // The { once: true } option is perfect here as we only care about the first end.
      next.addEventListener(
        "transitionend",
        (event) => {
          // It's crucial to check if the 'transform' property is the one that finished
          // as other properties might also have transitions on the same element.
          if (event.propertyName === "transform") {
            carouselHandlers.onNextSlideTransitionEnd(
              event,
              current,
              next,
              variables,
              nextIndex
            );
            resolve(); // Resolve the promise once the transition ends
          }
        },
        { once: true } // Ensure this handler runs only once for this specific transition
      );

      // Update the active indicator immediately for visual feedback
      carouselUtilities.setActiveIndicator({ elements, variables }, nextIndex);
    });
  },

  addAutoPlay: ({ variables, elements, carousel }) => {
    return setInterval(async () => {
      if (!variables.autoPlay) {
        return;
      }

      const nextIndex =
        variables.direction === "next"
          ? (variables.activeIndex + 1) % elements.carouselItems.length
          : variables.activeIndex - 1 < 0
          ? elements.carouselItems.length - 1
          : variables.activeIndex - 1;

      await carouselUtilities.gotoSlide(
        { carousel, elements, variables },
        nextIndex,
        variables.direction
      );
    }, variables.autoPlayInterval);
  },
};

const carouselHandlers = {
  onNextSlideTransitionEnd: (e, current, next, variables, nextIdx) => {
    // Remove the transition classes after the transition ends
    current.classList.remove(
      "carousel-item-start",
      "carousel-item-end",
      "active"
    );
    current.offsetHeight; // Trigger reflow to ensure the classes are removed correctly
    next.classList.remove(
      "carousel-item-next",
      "carousel-item-prev",
      "carousel-item-center",
      "carousel-item-show"
    );
    next.classList.add("active");
    variables.activeIndex = nextIdx;
    variables.isSliding = false;
  },

  onNextButtonClick: async ({ elements, carousel, variables }) => {
    const nextIndex =
      (variables.activeIndex + 1) % elements.carouselItems.length;
    await carouselUtilities.gotoSlide(
      { carousel, elements, variables },
      nextIndex,
      "next"
    );
  },

  onPrevButtonClick: async ({ elements, carousel, variables }) => {
    const nextIndex =
      variables.activeIndex - 1 < 0
        ? elements.carouselItems.length - 1
        : variables.activeIndex - 1;
    await carouselUtilities.gotoSlide(
      { carousel, elements, variables },
      nextIndex,
      "prev"
    );
  },

  onIndicatorButtonClick: async ({ elements, carousel, variables }, e) => {
    e.preventDefault(); // Prevent default action of the button
    if (e.target.tagName !== "BUTTON") {
      return; // Ensure the clicked element is a button
    }
    const target = e.target; // The clicked indicator button, this is thee button that was clicked, not the current target of the event, we will use event delegation to handle the click event
    const targetIndex = parseInt(target.getAttribute("data-slide-to"), 10);
    if (
      variables.isSliding ||
      targetIndex === variables.activeIndex ||
      isNaN(targetIndex) ||
      targetIndex < 0 ||
      targetIndex >= elements.carouselItems.length
    ) {
      return; // Prevent action if already sliding or same slide
    }
    let direction = "next";
    let actionsToTake = 0;
    if (targetIndex < variables.activeIndex) {
      const lengthIfGoingForward =
        elements.carouselItems.length - variables.activeIndex + targetIndex;
      const lengthIfGoingBackward = variables.activeIndex - targetIndex;

      if (lengthIfGoingBackward < lengthIfGoingForward) {
        direction = "prev"; // Going backward is shorter
        actionsToTake = lengthIfGoingBackward;
      } else {
        actionsToTake = lengthIfGoingForward; // Going forward is shorter
      }
    } else {
      // Always going forward
      actionsToTake = targetIndex - variables.activeIndex;
    }

    await carouselUtilities.gotoSlide(
      { carousel, elements, variables },
      targetIndex,
      direction
    );
  },
};

/* BOOKING MODAL */
const bookingModalElements = {
  carouselSection: document.querySelector("section#hero-carousel"),
  bookingButtons: document.querySelectorAll(".booking-button"),
  bookingModal: document.querySelector("#booking-modal"),
  closeButton: document.querySelector(".modal .close-button"),
};

const bookingModalUtilities = {
  isBookingButton: (element) => {
    return (
      element.tagName === "BUTTON" &&
      element.classList.contains("booking-btn") &&
      !element.classList.contains("disabled")
    );
  },
  showBookingModal: () => {
    if (!bookingModalElements.bookingModal) {
      console.error("Booking modal element not found.");
      return;
    }

    // This is the code to show the booking modal, we need to call a reflow to ensure the modal is displayed correctly before we adding the animation classes which is 'show'
    bookingModalElements.bookingModal.style.display = "block"; // Ensure the modal is visible
    bookingModalElements.bookingModal.offsetHeight; // Trigger reflow to ensure the modal is displayed correctly

    bookingModalElements.bookingModal.classList.add("show");
    bookingModalElements.bookingModal.setAttribute("aria-hidden", "false");
    bookingModalUtilities.enableModalBackdrop();
  },
  hideBookingModal: () => {
    if (!bookingModalElements.bookingModal) {
      console.error("Booking modal element not found.");
      return;
    }

    bookingModalElements.bookingModal.classList.remove("show");
    bookingModalElements.bookingModal.setAttribute("aria-hidden", "true");

    bookingModalElements.bookingModal.addEventListener(
      "transitionend",
      bookingModalHandlers.handleModalCloseTransitionEnd,
      { once: true }
    );
  },
  createBackdrop: (additionalClasses = []) => {
    const backdrop = document.createElement("div");
    backdrop.classList.add(
      "modal-backdrop",
      "fade",
      "show",
      ...additionalClasses
    );

    return backdrop;
  },
  createDefaultBackdrop: () => {
    const backdrop = bookingModalUtilities.createBackdrop();
    return backdrop;
  },
  enableModalBackdrop: () => {
    const newBackdrop = bookingModalUtilities.createDefaultBackdrop();
    document.body.appendChild(newBackdrop);
    newBackdrop.addEventListener(
      "click",
      bookingModalHandlers.handleBackdropClick
    );
  },
  removeAllBackdrop: () => {
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => {
      backdrop.remove();
    });
  },
  disableModalBackdrop: () => {
    bookingModalUtilities.removeAllBackdrop();
  },

  isModalCloseButton: (element) => {
    return (
      element.tagName === "BUTTON" &&
      (element.classList.contains("btn-close") ||
        element.classList.contains("btn-dismiss")) &&
      element.closest(".modal")
    );
  },
};

const bookingModalHandlers = {
  onBookingButtonClick: (e) => {
    e.preventDefault(); // Prevent default action of the button
    const target = e.target; // The clicked booking button, this is the button that was clicked, not the current target of the event, we will use event delegation to handle the click event
    if (!bookingModalUtilities.isBookingButton(target)) {
      return; // Ensure the clicked element is a booking button
    }

    bookingModalUtilities.showBookingModal();
  },

  handleBackdropClick: (e) => {
    if (!e.target.classList.contains("modal-backdrop")) {
      return;
    }

    bookingModalUtilities.hideBookingModal();
  },

  handleModalCloseTransitionEnd: (e) => {
    (e) => {
      bookingModalElements.bookingModal.style.display = ""; // Hide the modal after transition ends
      bookingModalUtilities.disableModalBackdrop();
    };

    bookingModalElements.bookingModal.style.display = "none"; // Hide the modal after transition ends
    bookingModalUtilities.disableModalBackdrop(); // Remove the backdrop after modal is hidden
  },
};

/* PACKAGES */
const packagesElements = {
  bookingButtons: document.querySelectorAll("#packages .booking-btn"),
};

/* FAQ */
const accordionElements = {
  accordions: document.querySelectorAll(".accordion"),
  accordionItems: document.querySelectorAll(".accordion-item"),
};

const accordionUtilities = {
  getHiddenElementHeight: (element) => {
    const parent = element.parentElement;
    const parentPreviousPosition = parent.style.position;
    const prevDisplay = element.style.display;
    const prevVisibility = element.style.visibility;
    const prevPosition = element.style.position;

    parent.style.position = "relative"; // Ensure the parent is positioned relative
    element.style.display = "block"; // Ensure the element is displayed
    element.style.visibility = "hidden"; // Hide the element visually
    element.style.position = "absolute"; // Remove it from the document flow

    const height = element.scrollHeight + "px"; // Get the full height of the element

    element.style.display = prevDisplay; // Restore previous display style
    element.style.visibility = prevVisibility; // Restore previous visibility style
    element.style.position = prevPosition; // Restore previous position style
    parent.style.position = parentPreviousPosition; // Restore parent's previous position style

    return height; // Return the height of the hidden element
  },
  animateExpanding: (element) => {
    element.classList.add("collapsing");
    element.style.height = "0px"; // Set height to 0 for expanding effect
    // element.offsetHeight; // Trigger reflow to ensure the height is set before transition
    requestAnimationFrame(() => {
      const height = accordionUtilities.getHiddenElementHeight(element); // Get the full height of the element
      element.style.height = height; // Set the height to the full height for collapsing effect
    });

    element.addEventListener(
      "transitionend",
      (e) => {
        element.classList.remove("collapsing");
        element.style.height = ""; // Reset height after collapsing
        element.classList.add("show");
      },
      { once: true } // Ensure this runs only once for this transition
    );
  },
  animateCollapsing: (element) => {
    element.classList.add("collapsing");
    const height = element.scrollHeight + "px"; // Get the full height of the element
    element.style.height = height; // Set the height to the full height for collapsing effect
    element.offsetHeight; // Trigger reflow to ensure the height is set before transition
    element.style.height = "0px"; // Set height to 0 for collapsing effect

    element.addEventListener(
      "transitionend",
      (e) => {
        element.classList.remove("collapsing");
        element.style.height = ""; // Reset height after collapsing
        element.classList.remove("show");
      },
      { once: true } // Ensure this runs only once for this transition
    );
  },
  getAccordionButtonByHeader: (header) =>
    header.querySelector(".accordion-button"),
  getCurrentAccordionItem: (header) => {
    const accordionButton =
      accordionUtilities.getAccordionButtonByHeader(header);
    if (!accordionButton) {
      console.error("Accordion button not found for the header.");
      return null; // Return null if no button is found
    }

    return accordionButton.closest(".accordion-item");
  },
  getCollapsedElement: (button) => {
    const collapsedTargetQuerySelector = button.getAttribute("data-target");
    if (!collapsedTargetQuerySelector) {
      console.error("Accordion button does not have a data-target attribute.");
      return null; // Return null if no data-target is found
    }

    const collapsedElement = document.querySelector(
      collapsedTargetQuerySelector
    );
    if (!collapsedElement) {
      console.error(
        `Collapsed element with selector "${collapsedTargetQuerySelector}" not found.`
      );
      return null; // Return null if the element is not found
    }

    return collapsedElement;
  },
  getAccordionByHeaderButton: (headerButton) => {
    const collapsedElement =
      accordionUtilities.getCollapsedElement(headerButton);

    if (!collapsedElement) {
      console.error("Collapsed element not found for the header button.");
      return null; // Return null if no collapsed element is found
    }

    const parentQuerySelectorStr = collapsedElement.getAttribute("data-parent");
    if (!parentQuerySelectorStr) {
      return collapsedElement.closest(".accordion");
    }

    const parentElement = document.querySelector(parentQuerySelectorStr);
    if (!parentElement) {
      console.error(
        `Parent accordion with selector "${parentQuerySelectorStr}" not found.`
      );
      return null; // Return null if the parent accordion is not found
    }

    return parentElement; // Return the parent accordion element
  },
  collapseItem: (header) => {
    const accordionButton =
      accordionUtilities.getAccordionButtonByHeader(header);
    const accordionCollapsedElement =
      accordionUtilities.getCollapsedElement(accordionButton);

    if (!accordionButton || !accordionCollapsedElement) {
      console.error("Accordion button or collapsed element not found.");
      return; // Ensure both elements are found
    }

    accordionUtilities.animateCollapsing(accordionCollapsedElement);

    accordionButton.classList.add("collapsed");
    accordionButton.setAttribute("aria-expanded", "false");
  },
  expandItemAndCollapseOthers: (header) => {
    const accordionButton =
      accordionUtilities.getAccordionButtonByHeader(header);
    const currentAccordionItem =
      accordionUtilities.getCurrentAccordionItem(header);
    const parentAccordion =
      accordionUtilities.getAccordionByHeaderButton(accordionButton);

    if (!accordionButton || !currentAccordionItem || !parentAccordion) {
      console.error(
        "Accordion button, current item, or parent accordion not found."
      );
      return; // Ensure all elements are found
    }

    // Collapse all other items in the same accordion
    parentAccordion.querySelectorAll(".accordion-item").forEach((item) => {
      if (item !== currentAccordionItem) {
        const button = item.querySelector(".accordion-button");
        if (button && !button.classList.contains("collapsed")) {
          const header = button.closest(".accordion-header");
          if (!header) {
            console.error("Accordion header not found for the button.");
            return; // Ensure the header is found
          }
          accordionUtilities.collapseItem(header);
        }
      }
    });

    // Expand the clicked item
    accordionButton.classList.remove("collapsed");
    accordionButton.setAttribute("aria-expanded", "true");

    const collapsedElement =
      accordionUtilities.getCollapsedElement(accordionButton);
    accordionUtilities.animateExpanding(collapsedElement);
    if (collapsedElement) {
      collapsedElement.classList.add("show");
    }
  },
};

const accordionHandlers = {
  onAccordionHeaderClick: (e) => {
    e.preventDefault(); // Prevent default action of the header click

    const header = e.currentTarget; // The clicked accordion header

    if (!header) {
      console.error("Accordion header not found.");

      return; // Ensure the clicked element is a header
    }

    if (
      !header.classList.contains("accordion-header") ||
      !header.closest(".accordion-item") ||
      header.classList.contains("disabled")
    ) {
      console.warn(
        "Clicked element is not a valid accordion header or is disabled."
      );
      return; // Ensure the clicked element is a valid accordion header
    }

    const accordionButton =
      accordionUtilities.getAccordionButtonByHeader(header);

    if (accordionButton.classList.contains("collapsed")) {
      return accordionUtilities.expandItemAndCollapseOthers(header);
    }

    accordionUtilities.collapseItem(header);
  },
};

/* MAIN PROGRAM */

const globalElements = {
  modals: document.querySelectorAll(".modal"),
};

const globalHandlers = {
  handleModalButtonClick: (e) => {
    e.preventDefault(); // Prevent default action of the button

    const target = e.target;
    if (!bookingModalUtilities.isModalCloseButton(target)) {
      return; // Ensure the clicked element is a close button
    }

    bookingModalUtilities.hideBookingModal();
  },
};

const onDOMContentLoaded = () => {
  navbarElements.navbarToggler.forEach((toggler) => {
    toggler.addEventListener("click", navbarHandlers.onToggleClick);
  });

  carouselElements.carousels.forEach((carousel) => {
    const elements = {
      carouselItems: carousel.querySelectorAll(".carousel-item"),
      nextButton: carousel.querySelector(".carousel-control-next"),
      prevButton: carousel.querySelector(".carousel-control-prev"),
      indicators: carousel.querySelector(".carousel-indicators"),
    };

    const variables = {
      activeIndex: -1,
      autoPlayInterval: 5000, // 3 seconds
      autoPlay: false,
      isSliding: false,
      defaultDirection: "next",
      direction: null, // Default direction for autoplay
      autoplayInterval: null, // Will hold the interval ID for autoplay
    };

    if (elements.carouselItems.length > 0) {
      const activeItemIndex = Array.from(elements.carouselItems).findIndex(
        (item) => item.classList.contains("active")
      );
      variables.activeIndex = activeItemIndex;
      if (activeItemIndex === -1) {
        elements.carouselItems[0].classList.add("active");
        variables.activeIndex = 0;
      }

      elements.carouselItems.forEach((item, index) => {
        const parser = new DOMParser();

        const newBtn = `
          <button
            type="button"
            data-slide-to="${index}"
            class="${index === variables.activeIndex ? "active" : ""}"
            aria-current="${index === variables.activeIndex ? "true" : "false"}"
            aria-label="Slide ${index + 1}">
          </button>
        `;

        const doc = parser.parseFromString(newBtn, "text/html");

        const newElements = doc.body.children;

        for (const newElement of newElements) {
          elements.indicators.appendChild(newElement);
        }
      });

      elements.indicators.addEventListener(
        "click",
        carouselHandlers.onIndicatorButtonClick.bind(null, {
          elements,
          carousel,
          variables,
        })
      );
    }

    if (
      carousel.dataset.autoPlay === "true" ||
      carousel.dataset.autoPlay === ""
    ) {
      variables.autoPlay = true;
      variables.autoPlayInterval =
        parseInt(carousel.dataset.autoPlayInterval) ||
        variables.autoPlayInterval;
      variables.direction =
        carousel.dataset.autoPlayDirection || variables.defaultDirection;
      if (variables.direction !== "next" && variables.direction !== "prev") {
        console.warn(
          `Invalid autoPlay direction "${variables.direction}" specified. Defaulting to "next".`
        );
        variables.direction = variables.defaultDirection;
      }

      // Start autoplay
      variables.autoplayInterval = carouselUtilities.addAutoPlay({
        elements,
        variables,
        carousel,
      });
    }

    elements.nextButton.addEventListener(
      "click",
      carouselHandlers.onNextButtonClick.bind(null, {
        carousel,
        elements,
        variables,
      })
    );

    elements.prevButton.addEventListener(
      "click",
      carouselHandlers.onPrevButtonClick.bind(null, {
        carousel,
        elements,
        variables,
      })
    );
  });

  bookingModalElements.carouselSection.addEventListener(
    "click",
    bookingModalHandlers.onBookingButtonClick
  );

  globalElements.modals.forEach((modal) => {
    modal.addEventListener("click", globalHandlers.handleModalButtonClick);
  });

  packagesElements.bookingButtons.forEach((button) => {
    button.addEventListener("click", bookingModalHandlers.onBookingButtonClick);
  });

  accordionElements.accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    if (header) {
      header.addEventListener(
        "click",
        accordionHandlers.onAccordionHeaderClick
      );
    }
  });
};

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
