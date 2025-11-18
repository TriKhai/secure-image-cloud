export default function Footer() {

    return (
<footer className="bg-gray-50 text-black py-4 mt-10 border-t border-gray-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center text-sm">
        <p className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} <span className="font-semibold">SecureImageCloud</span>.  
          All rights reserved.
        </p>
      </div>
    </footer>
    );
}