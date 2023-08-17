import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button,Alert  } from 'react-bootstrap';
import {  useNavigate } from 'react-router-dom';
import Compressor from 'compressorjs';

const EditProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let Id = searchParams.get('Id');
  let ProductName = searchParams.get('ProductName');
  let Price = searchParams.get('Price');
  let Category = searchParams.get('Category');
  let Description = searchParams.get('Description');
  let Image = searchParams.get('Image');
  

  // Sample initial product data
  const initialProduct = {
    _id: Id,
    ProductName: ProductName,
    Price: Price,
    Image: Image,
    Category: Category,
    Description: Description
    
  };
  const [product, setProduct] = useState(initialProduct);
  const [productImage, setProductImage] = useState(product.Image);
  const [compressedFile, setCompressedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = event => {
    const { name, value } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const convertToBase64 = e => {
    console.log("e",e);
    const img =e.target.files[0]
    new Compressor(img, {      
      quality: 0.6,
      maxHeight:500,
      maxWidth:500,
      convertSize:50000,
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        // const maxSizeInBytes = 50 * 1024; // 50kb
        // if (compressedResult.size <= maxSizeInBytes) {
        //   Compressor(compressedResult)
        // }
        setCompressedFile(compressedResult)
        var reader = new FileReader();
    reader.readAsDataURL(compressedResult);
    reader.onload = () => {
        console.log(reader.result);
        setProductImage(reader.result);
    };
    reader.onerror = error => {
        console.log("Error: ", error);
    };
      },
    });
    // var reader = new FileReader();
    // reader.readAsDataURL(compressedFile);
    // reader.onload = () => {
    //     console.log(reader.result);
    //     setProductImage(reader.result);
    // };
    // reader.onerror = error => {
    //     console.log("Error: ", error);
    // };
  };

  const productUpdate = async (updatedProduct) => {
    let query = `
        mutation productUpdate($_id:String,$ProductName:String,$Image:String,$Price:String,$Category:String,$Description:String) {
          productUpdate(_id: $_id,ProductName: $ProductName,Image:$Image,Price: $Price,Category: $Category,Description: $Description) {
              _id
          }
        }
        `;
      fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          _id: updatedProduct._id,
          ProductName: updatedProduct.ProductName,
          Image: productImage,
          Price: updatedProduct.Price,
          Category: updatedProduct.Category,
          Description: updatedProduct.Description,
        },
      }),
    }).then(async (response) => {
      let dataResponse = await response.json();
      console.log(dataResponse.data.productUpdate._id,"Updated product _id")

      if(dataResponse.data.productUpdate._id){
        alert(`The product details has been updated successfully`);
        navigate('/adminHome');
      }
      else{
        alert(`There has been an error. The product details has not been updated!`);
      }
    });
  };
  

  const handleSubmit = event => {
    event.preventDefault();
    const errors = {};

    if (!product.ProductName) {
      errors.ProductName = 'Please provide a product name.';
    }

    if (!product.Price) {
      errors.Price = 'Please provide a price.';
    }

    if (!product.Category) {
      errors.Category = 'Please select a category.';
    }

    if (!product.Description) {
      errors.Description = 'Please provide a description.';
    }

    if (!product.Image) {
      errors.Image = 'Please select an image.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }else{
      setValidationErrors({});
    }

    // If validation passes, proceed with product update
    // setValidationErrors({});
    console.log("product",product);
    productUpdate(product);
  };

  return (
    <div className="container">
    <div className="edit-product-page">
        <br />
      <h2>Edit Product</h2>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            name="ProductName"
            value={product.ProductName}
            onChange={handleInputChange}
            required 
            isInvalid={!!validationErrors.ProductName}
            
          />
          <Form.Control.Feedback type="invalid">
          {validationErrors.ProductName}
          </Form.Control.Feedback>
        </Form.Group>
        <br />

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="Price"
            value={product.Price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <br />
        <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="Category"
          value={product.Category}
          onChange={handleInputChange}
          required
        >
          <option value="Phones">Phones</option>
          <option value="Laptops">Laptops</option>
        </Form.Control>
      </Form.Group>
        <br />

        <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
                type="file"
                accept="image/*"
                // onChange={handleInputChange}
                // value={product.ProductName}
                onChange={convertToBase64}
            />
            {<img src={productImage} alt="Selected" style={{height: '150px', width: '200px', float: 'left', marginRight: '10px',marginTop: '10px',marginBottom:'10px'}}/>}
            </Form.Group>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="Description"
          value={product.Description}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
        <br />
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
    </div>
  );
};

export default EditProducts;