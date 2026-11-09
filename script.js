const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const currentYear = document.querySelector("#current-year");
const projectModal = document.querySelector("#project-modal");
const modalClose = document.querySelector(".modal-close");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalRole = document.querySelector("#modal-role");
const modalTechnologies = document.querySelector("#modal-technologies");
const modalResults = document.querySelector("#modal-results");
const contactForm = document.querySelector("#contact-form");
let lastFocusedProject = null;

const projectDetails = {
  develop: {
    name: "Develop",
    description:
      "예시 프로젝트: 사용자가 서비스의 핵심 기능을 빠르게 찾고 편하게 이용할 수 있는 반응형 웹사이트를 만들었습니다.",
    role: "화면 구조 설계, 프론트엔드 구현, 모바일 화면 최적화를 담당한 예시입니다.",
    technologies: ["HTML", "CSS", "JavaScript"],
    results: [
      "주요 화면과 기능을 하나의 일관된 흐름으로 구성했습니다.",
      "모바일과 데스크톱에서 사용할 수 있는 반응형 레이아웃을 구현했습니다.",
    ],
  },
  process: {
    name: "Process",
    description:
      "예시 프로젝트: 아이디어를 조사, 설계, 제작, 개선 단계로 나누어 팀이 진행 상황을 쉽게 공유할 수 있도록 정리했습니다.",
    role: "작업 단계 정의, 사용자 흐름 설계, 화면 프로토타입 제작을 담당한 예시입니다.",
    technologies: ["사용자 흐름 설계", "와이어프레임", "프로토타이핑"],
    results: [
      "복잡한 작업 과정을 이해하기 쉬운 단계로 나누었습니다.",
      "검토와 피드백을 반영할 수 있도록 반복 가능한 작업 흐름을 마련했습니다.",
    ],
  },
  information: {
    name: "Information",
    description:
      "예시 프로젝트: 여러 곳에 흩어진 정보를 핵심 위주로 묶어 읽기 쉽고 찾기 쉬운 디지털 안내 페이지로 구성했습니다.",
    role: "정보 분류, 콘텐츠 구조 설계, 시각적 계층과 가독성 개선을 담당한 예시입니다.",
    technologies: ["콘텐츠 구조화", "정보 디자인", "접근성 고려"],
    results: [
      "중요한 정보를 명확한 제목과 구역으로 구분했습니다.",
      "짧은 문장과 일관된 시각적 계층으로 콘텐츠 탐색을 돕도록 구성했습니다.",
    ],
  },
};

// 상세 정보 목록을 모달의 목록 요소에 안전하게 표시합니다.
function fillList(listElement, items) {
  listElement.replaceChildren(
    ...items.map((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      return listItem;
    }),
  );
}

// 선택한 카드의 예시 정보를 채우고 모달을 엽니다.
function openProjectDetails(projectId, trigger) {
  const project = Object.hasOwn(projectDetails, projectId) ? projectDetails[projectId] : null;
  if (
    !project ||
    !projectModal ||
    !modalClose ||
    !modalTitle ||
    !modalDescription ||
    !modalRole ||
    !modalTechnologies ||
    !modalResults
  ) {
    console.error("프로젝트 상세 정보를 표시할 수 없습니다.", projectId);
    return;
  }

  modalTitle.textContent = project.name;
  modalDescription.textContent = project.description;
  modalRole.textContent = project.role;
  fillList(modalTechnologies, project.technologies);
  fillList(modalResults, project.results);
  lastFocusedProject = trigger;
  projectModal.showModal();
  modalClose.focus();
}

// 모달을 닫고 열기 전 선택했던 프로젝트 카드로 포커스를 돌려줍니다.
function closeProjectDetails() {
  if (projectModal?.open) {
    projectModal.close();
  }
}

// Tab 키가 모달 바깥으로 빠져나가지 않도록 포커스를 순환합니다.
function keepFocusInsideModal(event) {
  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = projectModal.querySelectorAll(
    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (contactForm instanceof HTMLFormElement) {
  const formFields = [
    {
      input: contactForm.querySelector("#contact-name"),
      error: contactForm.querySelector("#contact-name-error"),
      requiredMessage: "Please enter your name.",
    },
    {
      input: contactForm.querySelector("#contact-email"),
      error: contactForm.querySelector("#contact-email-error"),
      requiredMessage: "Please enter your email address.",
    },
    {
      input: contactForm.querySelector("#contact-message"),
      error: contactForm.querySelector("#contact-message-error"),
      requiredMessage: "Please enter a message.",
    },
  ];
  const feedback = contactForm.querySelector("#contact-form-feedback");

  if (formFields.every(({ input, error }) => input instanceof HTMLElement && error instanceof HTMLElement) &&
      feedback instanceof HTMLElement) {
    contactForm.addEventListener("input", () => {
      feedback.textContent = "";
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstInvalidField = null;

      formFields.forEach(({ input, error, requiredMessage }) => {
        if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) ||
            !(error instanceof HTMLElement)) {
          return;
        }

        const value = input.value.trim();
        let errorMessage = value ? "" : requiredMessage;
        if (input instanceof HTMLInputElement && input.type === "email" && value) {
          const [localPart, domain] = value.split("@");
          const hasValidEmailFormat =
            !input.validity.typeMismatch &&
            Boolean(domain?.includes(".")) &&
            !localPart.startsWith(".") &&
            !localPart.endsWith(".") &&
            !localPart.includes("..");
          if (!hasValidEmailFormat) {
            errorMessage = "Please enter a valid email address.";
          }
        }

        error.textContent = errorMessage;
        input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
        if (errorMessage && firstInvalidField === null) {
          firstInvalidField = input;
        }
      });

      if (firstInvalidField instanceof HTMLElement) {
        feedback.textContent = "";
        firstInvalidField.focus();
        return;
      }

      feedback.textContent = "Your details look good. This demo does not send emails.";
    });
  } else {
    console.error("The contact form could not be initialized because a field is missing.");
  }
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    }
  });
}

document.querySelectorAll(".project-open").forEach((projectButton) => {
  projectButton.addEventListener("click", (event) => {
    event.preventDefault();
    openProjectDetails(projectButton.dataset.project, projectButton);
  });
  projectButton.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  });
  projectButton.addEventListener("keyup", (event) => {
    if (event.key === " ") {
      projectButton.click();
    }
  });
});

if (projectModal && modalClose) {
  modalClose.addEventListener("click", closeProjectDetails);
  projectModal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProjectDetails();
  });
  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) {
      closeProjectDetails();
    }
  });
  projectModal.addEventListener("keydown", keepFocusInsideModal);
  projectModal.addEventListener("close", () => {
    lastFocusedProject?.focus();
    lastFocusedProject = null;
  });
}
