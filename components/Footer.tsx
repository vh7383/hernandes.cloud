export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} Vincent Hernandes - hernandes.cloud</p>
      </div>
    </footer>
  );
}
