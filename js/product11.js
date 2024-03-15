document.addEventListener("DOMContentLoaded", function () {
    let productsData = null;
    let filteredData = null; // Variable to store the filtered data
  
   
    async function fetchOrGetProducts() {
      let data = localStorage.getItem("productsData");
      if (data) {
        productsData = JSON.parse(data);
        return productsData;
      } else {
        try {
          const response = await fetch("https://dummyjson.com/products");
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          productsData = await response.json();
          localStorage.setItem("productsData", JSON.stringify(productsData));
          return productsData;
        } catch (error) {
          console.error("Error fetching products:", error);
          return null; // Return null in case of error
        }
      }
    }
  
    // Function to render products based on provided data
    function renderProducts(data) {
      const productsSection = document.getElementById("productsSection");
      // Clear the existing products in the products section
      productsSection.innerHTML = "";
  
      if (!data || !data.products || data.products.length === 0) {
        productsSection.textContent = "No products found.";
        return;
      }
  
      // Iterate over each product in the array
      data.products.forEach((product, index) => {
        // Render product
        renderProduct(product, productsSection);
  
        // If this is the last product or every 6th product, render a new row
        if ((index + 1) % 6 === 0 || index === data.products.length - 1) {
          const row = document.createElement("div");
          row.classList.add("row", "mb-5");
          productsSection.appendChild(row);
        }
      });
    }
  
    // Function to render a single product card
    function renderProduct(product, parentElement) {
      const cardCol = document.createElement("div");
      cardCol.classList.add("col-md-2", "mb-3"); // Bootstrap column class
  
      const card = document.createElement("div");
      card.classList.add("card", "h-100", "d-flex", "flex-column"); // Apply flexbox to card
  
      // Product image
      const img = document.createElement("img");
      img.classList.add("card-img-top");
      img.src = product.thumbnail;
      img.style.width = "100%"; // Set fixed width
      img.style.maxHeight = "200px"; // Set maximum height to 200px
      img.alt = product.title;
      card.appendChild(img);
  
      // Product details
      const cardBody = document.createElement("div");
      cardBody.classList.add(
        "card-body",
        "p-4",
        "flex-grow-1",
        "d-flex",
        "flex-column"
      ); // Apply flexbox to card body
  
      // Create a div to contain product name and price
      const productInfo = document.createElement("div");
      productInfo.classList.add(
        "product-info",
        "flex-grow-1",
        "d-flex",
        "flex-column",
        "justify-content-between"
      ); // Apply flexbox to product info
      const productName = document.createElement("h5");
      productName.classList.add("fw-bolder", "mb-0");
      productName.textContent = product.title; // Display product name
      const productPrice = document.createElement("p");
      productPrice.classList.add("mb-0");
      productPrice.textContent = `$${product.price}`;
      productInfo.appendChild(productName);
      productInfo.appendChild(productPrice);
      cardBody.appendChild(productInfo);
      card.appendChild(cardBody);
  
      // Product actions
      const cardFooter = document.createElement("div");
      cardFooter.classList.add(
        "card-footer",
        "p-4",
        "pt-0",
        "border-top-0",
        "bg-transparent"
      );
      const textCenterFooter = document.createElement("div");
      textCenterFooter.classList.add("text-center");
      const viewOptionsBtn = document.createElement("a");
      viewOptionsBtn.classList.add("btn", "btn-outline-dark", "mt-auto");
      viewOptionsBtn.href = "#";
      viewOptionsBtn.textContent = "View options";
  
      // Add event listener to view options button
      viewOptionsBtn.addEventListener("click", function (event) {
        event.preventDefault();
        // Show popup with product details
        displayProductPopup(product);
      });
  
      textCenterFooter.appendChild(viewOptionsBtn);
      cardFooter.appendChild(textCenterFooter);
      card.appendChild(cardFooter);
  
      cardCol.appendChild(card);
      parentElement.appendChild(cardCol);
    }
  
    // Function to display a popup with additional product details
    function displayProductPopup(product) {
      // Create popup container
      const popup = document.createElement("div");
      popup.classList.add("popup");
  
      // Create close button
      const closeButton = document.createElement("button");
      closeButton.classList.add("close-btn");
      closeButton.textContent = "Close";
      closeButton.addEventListener("click", function () {
        popup.remove();
      });
  
      // Create product details container
      const productDetails = document.createElement("div");
      productDetails.classList.add("product-details");
  
      // Display product title, description, and other details
      productDetails.innerHTML = `
              <h2>${product.title}</h2>
              <p><strong>Category:</strong> ${product.category}</p>
              <p><strong>Description:</strong> ${product.description}</p>
              <p><strong>Price:</strong> $${product.price}</p>
              <p><strong>Rating:</strong> ${product.rating}</p>
              <p><strong>Stock:</strong> ${product.stock}</p>
          `;
  
      // Append elements to the popup container
      popup.appendChild(closeButton);
      popup.appendChild(productDetails);
  
      // Append popup to the body
      document.body.appendChild(popup);
    }
  
    // Call the fetchOrGetProducts function and handle the response
    fetchOrGetProducts()
      .then((data) => {
        if (!data) {
          console.error("Failed to fetch products");
          return;
        }
        console.log("Fetched products:", data);
        renderProducts(data);
  
        // Create product category dropdown
        const categoryDropdown = document.getElementById("categoryDropdown");
        const categories = [...new Set(data.products.map((p) => p.category))];
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.textContent = category;
          option.value = category;
          categoryDropdown.appendChild(option);
        });
  
        // Search functionality
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", applyFilters);
  
        // Category dropdown change event
        categoryDropdown.addEventListener("change", applyFilters);
  
        // Sorting dropdown change event
        document.getElementById("sortingDropdown").addEventListener("change", function() {
          applyFilters();
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    // Function to apply filters and sorting
    function applyFilters() {
      const keyword = searchInput.value.trim().toLowerCase();
      const selectedCategory = categoryDropdown.value.toLowerCase();
  
      let filteredProducts = productsData.products;
  
      // Filter by keyword and category
      filteredProducts = filterProducts(filteredProducts, keyword, selectedCategory);
  
      // Sorting
      const selectedSortingOption = document.getElementById("sortingDropdown").value;
      switch (selectedSortingOption) {
        case "az":
          filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "rating":
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case "latest":
          filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        default:
          break;
      }
  
      // Render filtered and sorted products
      renderProducts({ products: filteredProducts });
    }
  
    // Function to filter products by name and category
    function filterProducts(products, keyword, selectedCategory) {
      return products.filter(
        (product) =>
          (product.title.toLowerCase().includes(keyword) || keyword === "") &&
          (product.category.toLowerCase() === selectedCategory ||
            selectedCategory === "")
      );
    }
  });
  