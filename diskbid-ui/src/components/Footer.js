function Footer({ user }) {
  return (
    <footer className="h-10 bg-gray-700 text-white px-3 py-2">
      &copy;DiskBid {new Date().getFullYear()}
    </footer>
  );
}

export default Footer;
