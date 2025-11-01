export default function Footer() {

    return (
<footer className="bg-gray-100 text-gray-700 py-4 mt-10 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center text-sm">
        <p className="mb-2 md:mb-0">
          \copy {new Date().getFullYear()} <span className="font-semibold">MyApp</span>.  
          All rights reserved.
        </p>

        {/* <div className="flex space-x-4">
          <a href="/about" className="hover:text-blue-600">
            Giới thiệu
          </a>
          <a href="/contact" className="hover:text-blue-600">
            Liên hệ
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            GitHub
          </a>
        </div> */}
      </div>
    </footer>
    );
}