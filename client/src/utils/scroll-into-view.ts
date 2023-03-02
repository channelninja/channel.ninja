export function scrollIntoView(targetId: string, { offset }: { offset: number }) {
  const element = document.getElementById(targetId);
  if (!element) {
    return;
  }
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}
