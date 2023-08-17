import React, { useEffect, useState } from 'react';
import './css/Phones.css';
import phonesBanner from './img/phonesBanner.png';
import { Link } from 'react-router-dom';


const PhonesPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory] = useState('Phones');

  useEffect(() => {
    const fetchProducts = async () => {
      let query = `
    query  {
        productList {
            _id
            ProductName
            Description
            Image
            Price
            Category
        }
      }
      `;
      // try {
        fetch("https://gadget-zone-server-7sey2.ondigitalocean.app/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      }).then(async (response) => {
        let dataResponse = await response.json();
        console.log(dataResponse,"dataResponse")
        let data = dataResponse.data.productList;
        console.log(data,"data")
        setProducts(data);
      });
      // } catch (error) {
      //   console.error('Error fetching products:', error);
      // }
    };

    fetchProducts();
  }, []);
   const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.Category === selectedCategory);


  return (
<div className="products-grid">
    <h1>Phones</h1>
      <img src={phonesBanner} alt="Promotion Banner" className="promotion-banner" />
      <div className="products-container">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-item">
      <Link to={`/product?Id=${product._id}`}>
        <div className="product-image-container">
          <img className="product-image" src={product.Image} alt={product.ProductName} />
        </div>
        <h4>{product.ProductName}</h4>
        <h6><b>{product.Price} CAD</b></h6>
      </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhonesPage;
