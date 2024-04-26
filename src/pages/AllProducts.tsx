import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { addCategories, addProducts } from "../redux/features/productSlice";
import ProductCard from "../components/ProductCard";
import { Product } from "../models/Product";
import ReactPaginate from "react-paginate";

const AllProducts: FC = () => {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage] = useState(9);
  const [sortValue, setSortValue] = useState("default");
  const sortRef = useRef<HTMLSelectElement>(null);
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchTerm, setSearchTerm] = useState("");
  const allProducts = useAppSelector(
    (state) => state.productReducer.allProducts
  );
  const allCategories = useAppSelector(
    (state) => state.productReducer.categories
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = () => {
      fetch("https://dummyjson.com/products?limit=100")
        .then((res) => res.json())
        .then(({ products }) => {
          dispatch(addProducts(products));
        });
    };
    const fetchCategories = () => {
      fetch("https://dummyjson.com/products/categories")
        .then((res) => res.json())
        .then((data) => {
          dispatch(addCategories(data));
        });
    };
    if (allProducts.length === 0) fetchProducts();
    if (allCategories.length === 0) fetchCategories();
  }, [allProducts, allCategories, dispatch]);

  useEffect(() => {
    setCurrentProducts(allProducts);
  }, [allProducts]);

  useEffect(() => {
    if (category !== "all") {
      const updated = allProducts.filter((pro) => pro.category === category);
      setCurrentProducts(updated);
    }
  }, [category, allProducts]);

  useEffect(() => {
    let filteredProducts = [...allProducts];

    if (searchTerm !== "") {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setCurrentProducts(filteredProducts);
  }, [searchTerm, allProducts]);

  useEffect(() => {
    sortProducts(sortValue);
  }, [sortValue]);

  const sortProducts = (sortValue: string) => {
    let sortedProducts = [...currentProducts];

    switch (sortValue) {
      case "asc":
        sortedProducts = sortedProducts.sort((a, b) => {
          const aPrice =
            a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
          const bPrice =
            b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
          return aPrice - bPrice;
        });
        break;
      case "desc":
        sortedProducts = sortedProducts.sort((a, b) => {
          const aPrice =
            a.price - (a.price * (a.discountPercentage ?? 0)) / 100;
          const bPrice =
            b.price - (b.price * (b.discountPercentage ?? 0)) / 100;
          return bPrice - aPrice;
        });
        break;
      case "stock":
        sortedProducts = sortedProducts.sort((a, b) => {
          const aStock = a.stock ? a.stock : 0;
          const bStock = b.stock ? b.stock : 0;
          return bStock - aStock;
        });
        break;
      case "name":
        sortedProducts = sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // For "default", keep the products unchanged
        sortedProducts = [...allProducts];
        break;
    }

    setCurrentProducts(sortedProducts);
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const indexOfLastProduct = (currentPage + 1) * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProductsSlice = currentProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className='container mx-auto min-h-[83vh] p-4 font-karla'>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
        {windowWidth >= 768 && (
          <div className={`md:col-span-1`}>
            <h1 className="font-bold mb-2">Categories</h1>
            <div className="space-y-1">
              {allCategories.map((_category) => (
                <div
                  key={_category}
                  className={`cursor-pointer hover:text-blue-500 ${
                    _category === category ? "text-blue-500" : ""
                  }`}
                  onClick={() => {
                    setCategory(_category);
                    if (sortRef && sortRef.current)
                      sortRef.current.value = "default";
                    setSortValue("default");
                  }}
                >
                  {_category}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={`col-span-4 ${windowWidth >= 768 ? '' : 'md:col-span-5'}`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 text-lg ${windowWidth >= 768 ? '' : 'hidden md:block'}`}>
              <span>Products</span>
              <span> {">"} </span>
              <span className="font-bold">{category}</span>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <input
              type="text"
              placeholder="Search..."
              className={`border border-gray-300 rounded px-2 py-1 focus:border-blue-500 ${window.innerWidth < 365 ? 'text-xs' : ''}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                ref={sortRef}
                className={`border border-black rounded p-1 ml-2 ${windowWidth >= 400 ? '' : 'text-xs'}`}
                onChange={(e) => setSortValue(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="asc">Price (low to high)</option>
                <option value="desc">Price (high to low)</option>
                <option value="stock">Stock</option>
                <option value="name">Name</option> 
              </select>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1">
            {currentProductsSlice.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <ReactPaginate
            pageCount={Math.ceil(currentProducts.length / productsPerPage)}
            previousLabel={windowWidth < 500 ? "<" : "<<"}
            nextLabel={windowWidth < 500 ? ">" : ">>"}
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName={`pagination flex justify-center mt-4 items-center ${
              windowWidth < 500 ? "mx-auto" : ""
            }`}
            activeClassName={`bg-blue-500 text-white rounded-full px-1 py-2 ${
              windowWidth < 500 ? "text-sm" : ""
            }`}
            pageLinkClassName={` bg-white border border-gray-300 text-gray-700 rounded-full px-2 py-1 mx-1 ${
              windowWidth < 500 ? "text-sm" : ""
            }`}
            previousClassName="bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 mr-2"
            nextClassName="bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 ml-2"
            breakLinkClassName={` bg-white border border-gray-300 text-gray-700 rounded-full px-3 py-1 mx-1 ${
              windowWidth < 500 ? "text-sm px-1" : "px-3"
            }`}
            disabledClassName="disabled"
            pageClassName="inline-block"
          />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;