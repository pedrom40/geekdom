'use strict';

// main function that calls everything
function initAdmin () {

  // check for admin login
  checkForAdminSession();

}

// looks for active admin session
function checkForAdminSession () {

  // get page requested
  const viewRequested = window.location.pathname;

  // get admin user info
  getAdminSessionInfo()
    .then(adminUser => {

      // if admin user is not validated
      if (adminUser.validated === false && viewRequested !== '/admin/login') {

        // send to login page
        window.location.assign('/admin/login');

      }

      // if user is already validated
      else if (adminUser.validated) {

        // get view requested
        getViewRequested(viewRequested);

      }

      // if on login page
      else {

        // make for active by listening for submit
        listenForAdminLoginSubmit();

      }

    });

}

// called when login form submitted
function listenForAdminLoginSubmit () {

  $('.adminLoginForm').submit( event => {
    event.preventDefault();

    // send msg and disable login btn
    $('#adminLoginSubmitBtn').prop('value', 'Validating...');
    $('#adminLoginSubmitBtn').prop('disabled', true);

    // send to login function
    loginAdminUser();

  });

}

// find out what view the user wants
function getViewRequested (viewRequested) {

  // if dashboard view requested
  if (viewRequested === '/admin/dashboard') {

    // load dashboard
    loadAdminDashboard();

  }

  // if admin users list view requested
  else if (viewRequested === '/admin/users') {

    // load admin users view
    loadAdminUsers();

  }

  // if products view requested
  else if (viewRequested === '/admin/products') {

    // load view
    loadProducts();

  }

  // if product add view requested
  else if (viewRequested === '/admin/products/add') {

    // load view
    addProduct();

  }

  // if categories list view requested
  else if (viewRequested === '/admin/categories') {

    // load admin users view
    loadCategories();

  }

  // if printer list view requested
  else if (viewRequested === '/admin/printers') {

    // load printers view
    loadPrinters();

  }

  // if media list view requested
  else if (viewRequested === '/admin/media') {

    // load media view
    loadMedias();

  }

  // if flat charge list view requested
  else if (viewRequested === '/admin/flat-charges') {

    // load flat charges view
    loadFlatCharges();

  }

  // if turnaround list view requested
  else if (viewRequested === '/admin/turnarounds') {

    // load turnarounds view
    loadTurnarounds();

  }

  // if finishing list view requested
  else if (viewRequested === '/admin/finishing') {

    // load finishings view
    loadFinishings();

  }

  // if artwork option list view requested
  else if (viewRequested === '/admin/artwork-options') {

    // load artwork options view
    loadArtworkOptions();

  }

  // if size list view requested
  else if (viewRequested === '/admin/sizes') {

    // load size view
    loadSizes();

  }

  // if image list view requested
  else if (viewRequested === '/admin/images') {

    // load size view
    loadImages();

  }

}

// admin user functions
function loginAdminUser () {

  // create login obj
  const loginValues = {
    method: 'loginUser',
    email: $('#adminEmail').val(),
    password: $('#adminPassword').val()
  }

  // send to service for validation
  callAdminService(loginValues)
    .then( loginResponse => {

      // figure out how to handle the result
      handleLoginResponse(loginResponse);

    });

}
function handleLoginResponse (loginResponse) {

  // if login successfull
  if (loginResponse.validated) {

    // update admin user session
    updateAdminUserSession(loginResponse)
      .then( userResponse => {

        // send user to dashboard
        window.location.assign('/admin/dashboard');

      });

  }

  // if not
  else {

    // send failed msg
    showErrorMsg(loginResponse.msg);

    // reinstate login btn
    $('#adminLoginSubmitBtn').prop('value', 'LOGIN');
    $('#adminLoginSubmitBtn').prop('disabled', false);

  }

}
function updateAdminUserSession (adminUser) {

  // get user session info from express route
  const settings = {
    url: '/updateAdminUser/',
    data: adminUser,
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);

}
function getAdminSessionInfo () {
  const settings = {
    url: '/getAdminUser/',
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);
}


/** admin views **/

// dashboard
function loadAdminDashboard () {

  // setup order display
  let orderRowsHtml = '';
  callOrderService({method: 'getOrders'})
    .then( orders => {

      // markup order rows
      orders.map( order => {
        orderRowsHtml = `${orderRowsHtml}
          <tr>
            <td>${order[0]}</td>
            <td>${order[2]}</td>
            <td>${order[1]}</td>
            <td>${order[3]}</td>
            <td>${order[4]}</td>
          </tr>`;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const searchForm = `
        <div class="row">
          <div class="column">
            <label for="fromDate">From:</label>
            <input type="date" id="fromDate" placeholder="mm/dd/yyyy">
          </div>
          <div class="column">
            <label for="toDate">To:</label>
            <input type="date" id="toDate" placeholder="mm/dd/yyyy">
          </div>
          <div class="column">
            <label for="orderStatus">Status:</label>
            <select id="orderStatus">
              <option value="">All</option>
            </select>
          </div>
          <div class="column">
            <label for="orderNumber">Order #:</label>
            <input type="text" id="orderNumber" placeholder="XXX-XXXXXX">
          </div>
          <div class="column">
            <label for="products">Products:</label>
            <select id="products">
              <option value="">All</option>
            </select>
          </div>
        </div>
      `;

      // markup display
      const recentOrderList = `
        <div class="row">
          <div class="column">

            <h4>Orders</h4>

            ${searchForm}
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Order</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                ${orderRowsHtml}
              </tbody>
            </table>

          </div>
        </div>
      `;

      // start fresh
      $('.js-admin-placeholder').html(recentOrderList);

    });

}

// users
function loadAdminUsers () {

  // setup member display
  callUserService({method: 'getMembers'})
    .then( members => {

      // markup order rows
      let memberRowsHtml = '';
      members.map( member => {
        memberRowsHtml = `${memberRowsHtml}
          <tr>
            <td>${member[0]}</td>
            <td>${member[1]}</td>
            <td>${member[2]}</td>
            <td>${member[3]}</td>
          </tr>
        `;
      });

      // markup admin rows
      let adminRowsHtml = '';
      callUserService({method: 'getAdminUsers'})
        .then( adminUsers => {

          adminUsers.map( adminUser => {
            adminRowsHtml = `${adminRowsHtml}
              <tr>
                <td>${adminUser[1]}</td>
                <td class="admin-options">
                  <a href="#" title="Edit User"><i id="admin-edit-btn_${adminUser[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
                  <a href="#" title="Delete User"><i id="admin-delete-btn_${adminUser[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
                </td>
              </tr>
            `;
          });

          // start fresh
          $('.js-admin-placeholder').empty();

          // markup search form
          const memberSearchForm = `
            <div class="row">
              <div class="column">
                <label for="memberSearchTerm" class="sr-only">Member Search Term</label>
                <input type="text" id="memberSearchTerm" placeholder="Search by Name, Email or Phone">
              </div>
            </div>
          `;

          // markup admin form
          const adminForm = `
            <form class="js-admin-user-form">

              <label for="adminName">Name:</label>
              <input type="text" id="adminName" placeholder="New Guy" required>

              <label for="adminEmail">Email:</label>
              <input type="email" id="adminEmail" placeholder="new@guy.com" required>

              <label for="adminPassword">Password:</label>
              <input type="password" id="adminPassword" placeholder="******" required>

              <div class="row">
                <div class="column">
                  <input type="submit" id="adminSubmit" value="Add">
                </div>
                <div class="column">
                  <button onclick="loadAdminUsers()">Cancel</button>
                </div>
              </div>

              <input type="hidden" id="adminId">

            </form>
          `;

          // markup display
          const displayHtml = `
            <div class="row">
              <div class="column">
                <h4>Members</h4>

                ${memberSearchForm}
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${memberRowsHtml}
                  </tbody>
                </table>
              </div>
              <div class="column column-10"></div>
              <div class="column">
                <h4>Admin</h4>
                <table class="js-admin-table">
                  <tbody>
                    ${adminRowsHtml}
                  </tbody>
                </table>

                <br><h4 class="js-admin-form-title">Add Admin</h4>
                ${adminForm}
              </div>
            </div>
          `;

          // load markup to page
          $('.js-admin-placeholder').html(displayHtml);

        });

    });

  // setup listeners
  listenForAdminActions();

}
function editAdminUser (adminUserId) {

  // get user info
  callUserService({
    method: 'getAdminUser',
    adminUserId: adminUserId
  })
    .then( adminUser => {

      // update form content
      $('#adminId').val(adminUser[0]);
      $('#adminName').val(adminUser[1]);
      $('#adminEmail').val(adminUser[2]);

      // change for title and submit text
      $('.js-admin-form-title').html('Edit Admin');
      $('#adminSubmit').val('EDIT');

    });

}
function deleteAdminUser (adminUserId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Admin User?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callUserService({
      method: 'deleteAdminUser',
      adminUserId: adminUserId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadAdminUsers();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleAdminUserFormSubmit () {

  const formAction = $('#adminSubmit').val();

  // add admin user
  if (formAction === 'Add') {

    // send info to service
    callUserService({
      method: 'addAdminUser',
      adminName: $('#adminName').val(),
      adminEmail: $('#adminEmail').val(),
      adminPassword: $('#adminPassword').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadAdminUsers();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit admin user
  else {

    // send info to service
    callUserService({
      method: 'editAdminUser',
      adminId: $('#adminId').val(),
      adminName: $('#adminName').val(),
      adminEmail: $('#adminEmail').val(),
      adminPassword: $('#adminPassword').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadAdminUsers();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// products
function loadProducts () {

  // setup member display
  callProductsService({method: 'getProducts'})
    .then( products => {

      // markup rows
      let productRowsHtml = '';
      products.map( product => {

        // setup value for featured
        let productFeaturedStatus = '';
        if (product[4] === 1) {
          productFeaturedStatus = 'Yes';
        }
        else {
          productFeaturedStatus = 'No';
        }

        // setup value for active
        let productActiveStatus = '';
        if (product[5] === 1) {
          productActiveStatus = 'Yes';
        }
        else {
          productActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        productRowsHtml = `${productRowsHtml}
          <tr>
            <td><img src="https://static.bannerstack.com/img/products/${product[3]}"></td>
            <td>${product[1]}</td>
            <td>${product[2]}</td>
            <td>${productFeaturedStatus}</td>
            <td>${productActiveStatus}</td>
            <td class="admin-options">
              <a href="/admin/products/${product[0]}" title="Edit"><i id="product-edit-btn_${product[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="product-delete-btn_${product[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;

      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const productSearchForm = `
        <div class="row">
          <div class="column">
            <label for="productSearchTerm" class="sr-only">Product Search Term</label>
            <input type="text" id="productSearchTerm" placeholder="Search by Name, SKU or Description">
          </div>
        </div>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">

            <div id="js-product-add-btn" class="product-details-btn float-right">
              <i class="fa fa-plus" aria-hidden="true"></i>
              NEW PRODUCT
              <i class="fa fa-caret-right" aria-hidden="true"></i>
            </div>

            <h4>Products</h4>

            ${productSearchForm}
            <table>
              <thead>
                <tr>
                  <th width="85">Thumb</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Featured</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${productRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}
function addProduct () {

  const addProductForm = `
    <h4>New Product</h4>
    <form class="js-admin-product-form" enctype="multipart/form-data">
      <div class="row">
        <div class="column">
          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="Product Name" required>

          <label for="sku">SKU:</label>
          <input type="text" id="sku" placeholder="XXXXXX" required>

          <label for="shortDesc">Short Description:</label>
          <input type="text" id="shortDesc" placeholder="Short description, shows on list page" required>

          <label for="featured">Featured:</label>
          <select id="featured">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div class="column">
          <label for="longDesc">Detailed Description</label>
          <textarea id="longDesc" placeholder="Description that shows on product details page only" style="height:370px;"></textarea>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <div id="imgHolder"></div>
          <label for="imgThumb">Thumbnail:</label>
          <input type="file" id="fileupload" name="file" placeholder="jpg, gif and png files (RGB only)">
          <div id="progress">
            <div id="bar"></div>
          </div>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <label for="categoryId">Category:</label>
          <select id="categoryId"></select>
        </div>
        <div class="column">
          <label for="printerId">Printer:</label>
          <select id="printerId"></select>
        </div>
        <div class="column">
          <label for="mediaId">Media:</label>
          <select id="mediaId"></select>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <input type="submit" id="categorySubmit" value="Add">
        </div>
        <div class="column">
          <button onclick="loadCategories()">Cancel</button>
        </div>
      </div>

      <input type="hidden" id="imgList">
    </form>
  `;

  $('.js-admin-placeholder').append(addProductForm);

  // init file upload listener
  const uploadData = {
    methodUrl: 'products.cfc?method=uploadProductPic',
    imgNamePlaceholder: '#imgThumb',
    imgPreviewContainer: '#imgHolder',
    imgUrl: 'https://static.bannerstack.com/img/products'
  }
  listenForFileUploads(uploadData);

}
/*function editProduct (productId) {

  // get user info
  callProductsService({
    method: 'getCategory',
    categoryId: categoryId
  })
    .then( category => {

      // update form content
      $('#categoryId').val(category[0]);
      $('#categoryName').val(category[1]);
      $('#categoryImgHolder').html(`<img src="https://static.bannerstack.com/img/categories/${category[2]}">`);
      $('#categoryShortDesc').val(category[3]);
      $('#categoryLongDesc').val(category[4]);
      $('#categoryFeatured').val(category[5]);
      $('#categoryActive').val(category[6]);

      // change for title and submit text
      $('.js-form-title').html('Edit Category');
      $('#categorySubmit').val('EDIT');

    });

}
function deleteProduct (productId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Category?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteCategory',
      categoryId: categoryId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleProductFormSubmit () {

  const formAction = $('#categorySubmit').val();

  // add category
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addCategory',
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit category
  else {

    // send info to service
    callProductsService({
      method: 'editCategory',
      categoryId: $('#categoryId').val(),
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}*/

// product images
function loadImages () {

  // setup member display
  callProductsService({method: 'getImages'})
    .then( images => {

      // markup rows
      let imageRowsHtml = '';
      images.map( image => {

        // set in use
        let inUse = '';
        if (image[2]) {
          inUse = '<i class="fa fa-check-circle-o" aria-hidden="true"></i> In Use';
        }
        else {
          inUse = '<i class="fa fa-circle-o" aria-hidden="true"></i> Not In Use';
        }
        // add the rows to the HTML placeholder
        imageRowsHtml = `${imageRowsHtml}
          <div class="column">
            <img src="https://static.bannerstack.com/img/products/${image[1]}">
            <div class="column admin-options grey-bg">
              <div class="use-btn">${inUse}</div>
              <a href="#" title="Edit"><i id="category-edit-btn_${image[0]}" class="fa fa-pencil" aria-hidden="true"></i></a> &nbsp;
              <a href="#" title="Delete"><i id="category-delete-btn_${image[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </div>
          </div>
        `;

      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Product Images</h4>

            <div class="row">
              ${imageRowsHtml}
            </div>
          </div>
          <div class="column column-10"></div>
          <div class="column column-25">
            <h4 class="js-form-title">Add Images</h4>
            <div id="dropZone"></div>
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

    });

  dragAndDropUploads();

}

// product categories
function loadCategories () {

  // setup member display
  callProductsService({method: 'getCategories'})
    .then( categories => {

      // markup category rows
      let categoryRowsHtml = '';
      categories.map( category => {

        // setup value for featured
        let categoryFeaturedStatus = '';
        if (category[3] === 1) {
          categoryFeaturedStatus = 'Yes';
        }
        else {
          categoryFeaturedStatus = 'No';
        }

        // setup value for active
        let categoryActiveStatus = '';
        if (category[4] === 1) {
          categoryActiveStatus = 'Yes';
        }
        else {
          categoryActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        categoryRowsHtml = `${categoryRowsHtml}
          <tr>
            <td><img src="https://static.bannerstack.com/img/categories/${category[2]}"></td>
            <td>${category[1]}</td>
            <td>${categoryFeaturedStatus}</td>
            <td>${categoryActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="category-edit-btn_${category[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="category-delete-btn_${category[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const categorySearchForm = `
        <div class="row">
          <div class="column">
            <label for="categorySearchTerm" class="sr-only">Category Search Term</label>
            <input type="text" id="categorySearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup category form
      const categoryForm = `
        <form class="js-admin-category-form" enctype="multipart/form-data">

          <label for="categoryName">Name:</label>
          <input type="text" id="categoryName" placeholder="New Category" required>

          <div id="categoryImgHolder"></div>
          <label for="categoryThumb">Thumbnail:</label>
          <input type="file" id="fileupload" name="file" placeholder="jpg, gif and png files (RGB only)">
          <div id="progress">
            <div id="bar"></div>
          </div>

          <label for="categoryShortDesc">Short Description:</label>
          <input type="text" id="categoryShortDesc" placeholder="Short description" required>

          <label for="categoryLongDesc">Long Description:</label>
          <textarea id="categoryLongDesc" placeholder="Detailed category description"></textarea>

          <label for="categoryFeatured">Featured:</label>
          <select id="categoryFeatured">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label for="categoryActive">Active:</label>
          <select id="categoryActive">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="categorySubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadCategories()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="categoryId">
          <input type="hidden" id="categoryThumb">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Categories</h4>

            ${categorySearchForm}
            <table>
              <thead>
                <tr>
                  <th>Thumb</th>
                  <th>Name</th>
                  <th>Featured</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${categoryRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Category</h4>
            ${categoryForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

      // init file upload listener
      const uploadData = {
        methodUrl: 'products.cfc?method=uploadCategoryPic',
        imgNamePlaceholder: '#categoryThumb',
        imgPreviewContainer: '#categoryImgHolder',
        imgUrl: 'https://static.bannerstack.com/img/categories'
      }
      listenForFileUploads(uploadData);

    });

}
function editCategory (categoryId) {

  // get user info
  callProductsService({
    method: 'getCategory',
    categoryId: categoryId
  })
    .then( category => {

      // update form content
      $('#categoryId').val(category[0]);
      $('#categoryName').val(category[1]);
      $('#categoryImgHolder').html(`<img src="https://static.bannerstack.com/img/categories/${category[2]}">`);
      $('#categoryShortDesc').val(category[3]);
      $('#categoryLongDesc').val(category[4]);
      $('#categoryFeatured').val(category[5]);
      $('#categoryActive').val(category[6]);

      // change for title and submit text
      $('.js-form-title').html('Edit Category');
      $('#categorySubmit').val('EDIT');

    });

}
function deleteCategory (categoryId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Category?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteCategory',
      categoryId: categoryId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleCategoryFormSubmit () {

  const formAction = $('#categorySubmit').val();

  // add category
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addCategory',
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit category
  else {

    // send info to service
    callProductsService({
      method: 'editCategory',
      categoryId: $('#categoryId').val(),
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// printers
function loadPrinters () {

  // setup member display
  callProductsService({method: 'getPrinters'})
    .then( printers => {

      // markup rows
      let printerRowsHtml = '';
      printers.map( printer => {

        // setup value for active
        let printerActiveStatus = '';
        if (printer[2] === 1) {
          printerActiveStatus = 'Yes';
        }
        else {
          printerActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        printerRowsHtml = `${printerRowsHtml}
          <tr>
            <td>${printer[1]}</td>
            <td>${printerActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="printer-edit-btn_${printer[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="printer-delete-btn_${printer[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const printerSearchForm = `
        <div class="row">
          <div class="column">
            <label for="printerSearchTerm" class="sr-only">Printer Search Term</label>
            <input type="text" id="printerSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const printerForm = `
        <form class="js-admin-printer-form" enctype="multipart/form-data">

          <label for="printerName">Name:</label>
          <input type="text" id="printerName" placeholder="New Printer" required>

          <label for="printerTimeToRunJobFactor">Time to Run Job Factor:</label>
          <input type="number" id="printerTimeToRunJobFactor" placeholder="0.00000" required>

          <label for="printerInkUsageFactor">Ink Usage Factor:</label>
          <input type="number" id="printerInkUsageFactor" placeholder="0.0" required>

          <label for="printerInkCostFactor">Ink Cost Factor:</label>
          <input type="number" id="printerInkCostFactor" placeholder="0.00000" required>

          <label for="printerOverheadFactor">Overhead Factor:</label>
          <input type="number" id="printerOverheadFactor" placeholder="0.00" required>

          <label for="printerActive">Active:</label>
          <select id="printerActive">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="printerSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadPrinters()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="printerId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Printers</h4>

            ${printerSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${printerRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Printer</h4>
            ${printerForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}
function editPrinter (printerId) {

  // get user info
  callProductsService({
    method: 'getPrinter',
    printerId: printerId
  })
    .then( printer => {

      // update form content
      $('#printerId').val(printer[0]);
      $('#printerName').val(printer[1]);
      $('#printerTimeToRunJobFactor').val(printer[2]);
      $('#printerInkUsageFactor').val(printer[3]);
      $('#printerInkCostFactor').val(printer[4]);
      $('#printerOverheadFactor').val(printer[5]);
      $('#printerActive').val(printer[10]);

      // change for title and submit text
      $('.js-form-title').html('Edit Printer');
      $('#printerSubmit').val('EDIT');

    });

}
function deletePrinter (printerId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Printer?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deletePrinter',
      printerId: printerId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadPrinters();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handlePrinterFormSubmit () {

  const formAction = $('#printerSubmit').val();

  // add printer
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addPrinter',
      printerName: $('#printerName').val(),
      printerTimeToRunJobFactor: $('#printerTimeToRunJobFactor').val(),
      printerInkUsageFactor: $('#printerInkUsageFactor').val(),
      printerInkCostFactor: $('#printerInkCostFactor').val(),
      printerOverheadFactor: $('#printerOverheadFactor').val(),
      printerAddedBy: 0,
      printerActive: $('#printerActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadPrinters();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit printer
  else {

    // send info to service
    callProductsService({
      method: 'editPrinter',
      printerId: $('#printerId').val(),
      printerName: $('#printerName').val(),
      printerTimeToRunJobFactor: $('#printerTimeToRunJobFactor').val(),
      printerInkUsageFactor: $('#printerInkUsageFactor').val(),
      printerInkCostFactor: $('#printerInkCostFactor').val(),
      printerOverheadFactor: $('#printerOverheadFactor').val(),
      printerUpdatedBy: 0,
      printerActive: $('#printerActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadPrinters();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// media
function loadMedias () {

  // setup display
  callProductsService({method: 'getMedias'})
    .then( medias => {

      // markup rows
      let mediaRowsHtml = '';
      medias.map( media => {

        // setup value for active
        let mediaActiveStatus = '';
        if (media[14] === 1) {
          mediaActiveStatus = 'Yes';
        }
        else {
          mediaActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        mediaRowsHtml = `${mediaRowsHtml}
          <tr>
            <td>${media[1]}</td>
            <td>${media[4]}</td>
            <td>${media[5]}</td>
            <td>${media[7]}</td>
            <td>${mediaActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="media-edit-btn_${media[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="media-delete-btn_${media[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const mediaSearchForm = `
        <div class="row">
          <div class="column">
            <label for="mediaSearchTerm" class="sr-only">Media Search Term</label>
            <input type="text" id="mediaSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const mediaForm = `
        <form class="js-admin-media-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Media" required>

          <label for="printerIds">Printers:</label>
          <select id="printerIds" multiple></select>

          <label for="wasteFactor">Waste Factor:</label>
          <input type="number" id="wasteFactor" placeholder="0.00" required>

          <label for="rollWidth">Roll Width:</label>
          <input type="number" id="rollWidth" placeholder="0.00" required onChange="calcTotalSqFt()">

          <label for="rollLength">Roll Length:</label>
          <input type="number" id="rollLength" placeholder="0.00" required onChange="calcTotalSqFt()">

          <label for="rollTotalSqFt">Roll Total Sq Ft:</label>
          <input type="number" id="rollTotalSqFt" placeholder="0.00" required readonly>

          <label for="rollPrice">Roll Price ($):</label>
          <input type="number" id="rollPrice" placeholder="0.00" required onChange="calcPricePerSqFt()">

          <label for="pricePerSqFt">Price Per Sq Ft ($):</label>
          <input type="number" id="pricePerSqFt" placeholder="0.00" required readonly>

          <label for="mSquaredFeeFactor">M Squared Fee Factor:</label>
          <input type="number" id="mSquaredFeeFactor" placeholder="0.00" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="mediaSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadMedias()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="mediaId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Media</h4>

            ${mediaSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Width</th>
                  <th>Length</th>
                  <th>Price</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${mediaRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Media</h4>
            ${mediaForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // get all printers
      getActivePrinters();

      // setup listeners
      listenForAdminActions();

    });

}
function editMedia (mediaId) {

  // get user info
  callProductsService({
    method: 'getMedia',
    mediaId: mediaId
  })
    .then( media => {

      // update form content
      $('#mediaId').val(media[0]);
      $('#name').val(media[1]);
      $('#printerIds').val(media[2]);
      $('#wasteFactor').val(media[3]);
      $('#rollWidth').val(media[4]);
      $('#rollLength').val(media[5]);
      $('#rollTotalSqFt').val(media[6]);
      $('#rollPrice').val(media[7]);
      $('#pricePerSqFt').val(media[8]);
      $('#mSquaredFeeFactor').val(media[9]);
      $('#active').val(media[14]);

      // change for title and submit text
      $('.js-form-title').html('Edit Media');
      $('#mediaSubmit').val('EDIT');

    });

}
function deleteMedia (mediaId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Media?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteMedia',
      mediaId: mediaId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadMedias();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleMediaFormSubmit () {

  const formAction = $('#mediaSubmit').val();

  // add media
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addMedia',
      name: $('#name').val(),
      printerIds: $('#printerIds').val().join(','),
      wasteFactor: Number($('#wasteFactor').val()).toFixed(2),
      rollWidth: Number($('#rollWidth').val()).toFixed(2),
      rollLength: Number($('#rollLength').val()).toFixed(2),
      rollTotalSqFt: Number($('#rollTotalSqFt').val()).toFixed(2),
      rollPrice: Number($('#rollPrice').val()).toFixed(2),
      pricePerSqFt: Number($('#pricePerSqFt').val()).toFixed(2),
      mSquaredFeeFactor: Number($('#mSquaredFeeFactor').val()).toFixed(2),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadMedias();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit media
  else {

    // send info to service
    callProductsService({
      method: 'editMedia',
      mediaId: $('#mediaId').val(),
      name: $('#name').val(),
      printerIds: $('#printerIds').val().join(','),
      wasteFactor: Number($('#wasteFactor').val()).toFixed(2),
      rollWidth: Number($('#rollWidth').val()).toFixed(2),
      rollLength: Number($('#rollLength').val()).toFixed(2),
      rollTotalSqFt: Number($('#rollTotalSqFt').val()).toFixed(2),
      rollPrice: Number($('#rollPrice').val()).toFixed(2),
      pricePerSqFt: Number($('#pricePerSqFt').val()).toFixed(2),
      mSquaredFeeFactor: Number($('#mSquaredFeeFactor').val()).toFixed(2),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadMedias();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
function getActivePrinters () {

  // get active printers
  callProductsService({method: 'getActivePrinters'})
    .then( printers => {

      // remove all options
      $('#printerIds').html('');

      // loop thru all printers
      let printerOptions = '';
      printers.map( printer => {

        // add options to variable that will populate the printer select menu
        printerOptions = `${printerOptions}<option value="${printer[0]}">${printer[1]}</option>`;

      });

      // send options to select menu
      $('#printerIds').append(printerOptions);

    });

}
function calcTotalSqFt () {

  if ($('#rollWidth').val() !== '' && $('#rollLength').val() !== '') {

    const totalSqFt = Number($('#rollWidth').val()) * Number($('#rollLength').val());
    $('#rollTotalSqFt').val(totalSqFt);

  }

}
function calcPricePerSqFt () {

  if ($('#rollTotalSqFt').val() !== '' && $('#rollPrice').val() !== '') {

    const pricePerSqFt = Number($('#rollPrice').val()) / Number($('#rollTotalSqFt').val());
    $('#pricePerSqFt').val(pricePerSqFt.toFixed(2));

  }

}

// flat charges
function loadFlatCharges () {

  // setup member display
  callProductsService({method: 'getFlatCharges'})
    .then( flatCharges => {

      // markup rows
      let flatChargeRowsHtml = '';
      flatCharges.map( flatCharge => {

        // setup value for active
        let flatChargeActiveStatus = '';
        if (flatCharge[8] === 1) {
          flatChargeActiveStatus = 'Yes';
        }
        else {
          flatChargeActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        flatChargeRowsHtml = `${flatChargeRowsHtml}
          <tr>
            <td>${flatCharge[1]}</td>
            <td>${flatCharge[2]}</td>
            <td>${flatChargeActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="flatCharge-edit-btn_${flatCharge[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="flatCharge-delete-btn_${flatCharge[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const flatChargeSearchForm = `
        <div class="row">
          <div class="column">
            <label for="flatChargeSearchTerm" class="sr-only">Flat Charge Search Term</label>
            <input type="text" id="flatChargeSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const flatChargeForm = `
        <form class="js-admin-flatCharge-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Flat Charge" required>

          <label for="cost">Cost ($):</label>
          <input type="number" id="cost" placeholder="0.00" required>

          <label for="description">Description:</label>
          <input type="text" id="description" placeholder="Short description">

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="flatChargeSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadFlatCharges()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="flatChargeId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Flat Charges</h4>

            ${flatChargeSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${flatChargeRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Flat Charge</h4>
            ${flatChargeForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}
function editFlatCharge (flatChargeId) {

  // get user info
  callProductsService({
    method: 'getFlatCharge',
    flatChargeId: flatChargeId
  })
    .then( flatCharge => {

      // update form content
      $('#flatChargeId').val(flatCharge[0]);
      $('#name').val(flatCharge[1]);
      $('#cost').val(flatCharge[2].toFixed(2));
      $('#description').val(flatCharge[3]);
      $('#active').val(flatCharge[8]);

      // change for title and submit text
      $('.js-form-title').html('Edit Flat Charge');
      $('#flatChargeSubmit').val('EDIT');

    });

}
function deleteFlatCharge (flatChargeId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Flat Charge?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteFlatCharge',
      flatChargeId: flatChargeId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadFlatCharges();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleFlatChargeFormSubmit () {

  const formAction = $('#flatChargeSubmit').val();

  // add flat charge
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addFlatCharge',
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      description: $('#description').val(),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFlatCharges();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit printer
  else {

    // send info to service
    callProductsService({
      method: 'editFlatCharge',
      flatChargeId: $('#flatChargeId').val(),
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      description: $('#description').val(),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFlatCharges();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// artwork options
function loadArtworkOptions () {

  // setup member display
  callProductsService({method: 'getArtworkOptions'})
    .then( artworkOptions => {

      // markup rows
      let artworkOptionRowsHtml = '';
      artworkOptions.map( artworkOption => {

        // setup value for active
        let artworkOptionActiveStatus = '';
        if (artworkOption[7] === 1) {
          artworkOptionActiveStatus = 'Yes';
        }
        else {
          artworkOptionActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        artworkOptionRowsHtml = `${artworkOptionRowsHtml}
          <tr>
            <td>${artworkOption[1]}</td>
            <td>${artworkOption[2]}</td>
            <td>${artworkOptionActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="artworkOption-edit-btn_${artworkOption[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="artworkOption-delete-btn_${artworkOption[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const artworkOptionSearchForm = `
        <div class="row">
          <div class="column">
            <label for="artworkOptionSearchTerm" class="sr-only">Artwork Option Search Term</label>
            <input type="text" id="artworkOptionSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const artworkOptionForm = `
        <form class="js-admin-artworkOption-form">

        <label for="description">Description:</label>
        <input type="text" id="description" placeholder="Short description" required>

          <label for="cost">Cost ($):</label>
          <input type="number" id="cost" placeholder="0.00" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="artworkOptionSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadArtworkOptions()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="artworkOptionId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Artwork Options</h4>

            ${artworkOptionSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${artworkOptionRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Artwork Option</h4>
            ${artworkOptionForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}
function editArtworkOption (artworkOptionId) {

  // get user info
  callProductsService({
    method: 'getArtworkOption',
    artworkOptionId: artworkOptionId
  })
    .then( artworkOption => {

      // update form content
      $('#artworkOptionId').val(artworkOption[0]);
      $('#description').val(artworkOption[1]);
      $('#cost').val(artworkOption[2].toFixed(2));
      $('#active').val(artworkOption[7]);

      // change for title and submit text
      $('.js-form-title').html('Edit Artwork Option');
      $('#artworkOptionSubmit').val('EDIT');

    });

}
function deleteArtworkOption (artworkOptionId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Artwork Option?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteArtworkOption',
      artworkOptionId: artworkOptionId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadArtworkOptions();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleArtworkOptionFormSubmit () {

  const formAction = $('#artworkOptionSubmit').val();

  // adding
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addArtworkOption',
      description: $('#description').val(),
      cost: Number($('#cost').val()).toFixed(2),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadArtworkOptions();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // editing
  else {

    // send info to service
    callProductsService({
      method: 'editArtworkOption',
      artworkOptionId: $('#artworkOptionId').val(),
      description: $('#description').val(),
      cost: Number($('#cost').val()).toFixed(2),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadArtworkOptions();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// turnarounds
function loadTurnarounds () {

  // setup member display
  callProductsService({method: 'getTurnarounds'})
    .then( turnarounds => {

      // markup rows
      let turnaroundRowsHtml = '';
      turnarounds.map( turnaround => {

        // setup value for active
        let turnaroundActiveStatus = '';
        if (turnaround[7] === 1) {
          turnaroundActiveStatus = 'Yes';
        }
        else {
          turnaroundActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        turnaroundRowsHtml = `${turnaroundRowsHtml}
          <tr>
            <td>${turnaround[1]}</td>
            <td>${turnaround[2]}</td>
            <td>${turnaroundActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="turnaround-edit-btn_${turnaround[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="turnaround-delete-btn_${turnaround[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const turnaroundSearchForm = `
        <div class="row">
          <div class="column">
            <label for="turnaroundSearchTerm" class="sr-only">Turnaround Search Term</label>
            <input type="text" id="turnaroundSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const turnaroundForm = `
        <form class="js-admin-turnaround-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Turnaround" required>

          <label for="markup">Markup:</label>
          <input type="number" id="markup" placeholder="0.25" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="turnaroundSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadTurnarounds()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="turnaroundId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Turnarounds</h4>

            ${turnaroundSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Markup</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${turnaroundRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Turnaround</h4>
            ${turnaroundForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}
function editTurnaround (turnaroundId) {

  // get user info
  callProductsService({
    method: 'getTurnaround',
    turnaroundId: turnaroundId
  })
    .then( turnaround => {

      // update form content
      $('#turnaroundId').val(turnaround[0]);
      $('#name').val(turnaround[1]);
      $('#markup').val(turnaround[2].toFixed(2));
      $('#active').val(turnaround[7]);

      // change for title and submit text
      $('.js-form-title').html('Edit Turnaround');
      $('#turnaroundSubmit').val('EDIT');

    });

}
function deleteTurnaround (turnaroundId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Turnaround?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteTurnaround',
      turnaroundId: turnaroundId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadTurnarounds();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleTurnaroundFormSubmit () {

  const formAction = $('#turnaroundSubmit').val();

  // add turnaround
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addTurnaround',
      name: $('#name').val(),
      markup: Number($('#markup').val()).toFixed(2),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadTurnarounds();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit turnaround
  else {

    // send info to service
    callProductsService({
      method: 'editTurnaround',
      turnaroundId: $('#turnaroundId').val(),
      name: $('#name').val(),
      markup: Number($('#markup').val()).toFixed(2),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadTurnarounds();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// finishings
function loadFinishings () {

  // setup member display
  callProductsService({method: 'getFinishings'})
    .then( finishings => {

      // markup rows
      let finishingRowsHtml = '';
      finishings.map( finishing => {

        // setup value for active
        let finishingActiveStatus = '';
        if (finishing[9] === 1) {
          finishingActiveStatus = 'Yes';
        }
        else {
          finishingActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        finishingRowsHtml = `${finishingRowsHtml}
          <tr>
            <td>${finishing[1]}</td>
            <td>${finishing[2]}</td>
            <td>${finishing[3]}</td>
            <td>${finishingActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="finishing-edit-btn_${finishing[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="finishing-delete-btn_${finishing[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const finishingSearchForm = `
        <div class="row">
          <div class="column">
            <label for="finishingSearchTerm" class="sr-only">Finishing Search Term</label>
            <input type="text" id="finishingSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const finishingForm = `
        <form class="js-admin-finishing-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Finishing" required>

          <label for="cost">Cost ($):</label>
          <input type="number" id="cost" placeholder="0.00" required>

          <label for="runTime">Run Time:</label>
          <input type="text" id="runTime" placeholder="Run Time">

          <label for="printerIds">Printers:</label>
          <select id="printerIds" multiple></select>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="finishingSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadFinishings()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="finishingId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Finishing</h4>

            ${finishingSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Run Time</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${finishingRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Finishing</h4>
            ${finishingForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // get all printers
      getActivePrinters();

      // setup listeners
      listenForAdminActions();

    });

}
function editFinishing (finishingId) {

  // get user info
  callProductsService({
    method: 'getFinishing',
    finishingId: finishingId
  })
    .then( finishing => {

      // update form content
      $('#finishingId').val(finishing[0]);
      $('#name').val(finishing[1]);
      $('#cost').val(finishing[2].toFixed(2));
      $('#runTime').val(finishing[3]);
      $('#printerIds').val(finishing[4]);
      $('#active').val(finishing[9]);

      // change for title and submit text
      $('.js-form-title').html('Edit Finishing');
      $('#finishingSubmit').val('EDIT');

    });

}
function deleteFinishing (finishingId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Finishing?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteFinishing',
      finishingId: finishingId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadFinishings();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleFinishingFormSubmit () {

  const formAction = $('#finishingSubmit').val();

  // add finishing
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addFinishing',
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      runTime: $('#runTime').val(),
      printerIds: $('#printerIds').val().join(','),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFinishings();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit finishing
  else {

    // send info to service
    callProductsService({
      method: 'editFinishing',
      finishingId: $('#finishingId').val(),
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      runTime: $('#runTime').val(),
      printerIds: $('#printerIds').val().join(','),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFinishings();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// sizes
function loadSizes () {

  // setup member display
  callProductsService({method: 'getSizes'})
    .then( sizes => {

      // markup rows
      let sizeRowsHtml = '';
      sizes.map( size => {

        // setup value for active
        let sizeActiveStatus = '';
        if (size[3] === 1) {
          sizeActiveStatus = 'Yes';
        }
        else {
          sizeActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        sizeRowsHtml = `${sizeRowsHtml}
          <tr>
            <td>${size[1]}</td>
            <td>${size[2]}</td>
            <td>${sizeActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="size-edit-btn_${size[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="size-delete-btn_${size[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const sizeSearchForm = `
        <div class="row">
          <div class="column">
            <label for="sizeSearchTerm" class="sr-only">Size Search Term</label>
            <input type="text" id="sizeSearchTerm" placeholder="Search by Width and Height">
          </div>
        </div>
      `;

      // markup form
      const sizeForm = `
        <form class="js-admin-size-form">

          <label for="productWidth">Width:</label>
          <input type="text" id="productWidth" placeholder="Inches, numbers only" required>

          <label for="productHeight">Height:</label>
          <input type="text" id="productHeight" placeholder="Inches, numbers only" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="sizeSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadSizes()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="sizeId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Sizes</h4>

            ${sizeSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${sizeRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Size</h4>
            ${sizeForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}
function editSize (sizeId) {

  // get user info
  callProductsService({
    method: 'getSize',
    sizeId: sizeId
  })
    .then( size => {

      // update form content
      $('#sizeId').val(size[0]);
      $('#productWidth').val(size[1]);
      $('#productHeight').val(size[2]);
      $('#active').val(size[3]);

      // change for title and submit text
      $('.js-form-title').html('Edit Size');
      $('#sizeSubmit').val('EDIT');

    });

}
function deleteSize (sizeId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Size?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteSize',
      sizeId: sizeId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadSizes();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
function handleSizeFormSubmit () {

  const formAction = $('#sizeSubmit').val();

  // add
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addSize',
      productWidth: $('#productWidth').val(),
      productHeight: $('#productHeight').val(),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadSizes();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit
  else {

    // send info to service
    callProductsService({
      method: 'editSize',
      sizeId: $('#sizeId').val(),
      productWidth: $('#productWidth').val(),
      productHeight: $('#productHeight').val(),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadSizes();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}


// listens for admin user edit/delete btn clicks and admin form submits
function listenForAdminActions () {

  $('.js-admin-placeholder').click( event => {

    // if this is not a file input
    if (event.target.id !== 'fileupload') {

      event.preventDefault();

      // for admin user edit click
      if (event.target.id.search('admin-edit-btn') !== -1) {
        const adminUserId = event.target.id.toString().split('_');
        editAdminUser(adminUserId[1]);
      }

      // if admin user delete click
      else if (event.target.id.search('admin-delete-btn') !== -1) {
        const adminUserId = event.target.id.toString().split('_');
        deleteAdminUser(adminUserId[1]);
      }

      // for admin form submits
      else if (event.target.id === 'adminSubmit') {
        $('#adminSubmit').attr('disabled', 'disabled');
        handleAdminUserFormSubmit();
      }


      // add new product click
      else if (event.target.id === 'js-product-add-btn') {
        window.location.assign('/admin/products/add');
      }

      // if category edit click
      else if (event.target.id.search('category-edit-btn') !== -1) {
        const categoryId = event.target.id.toString().split('_');
        editCategory(categoryId[1]);
      }

      // if category delete click
      else if (event.target.id.search('category-delete-btn') !== -1) {
        const categoryId = event.target.id.toString().split('_');
        deleteCategory(categoryId[1]);
      }

      // if printer edit click
      else if (event.target.id.search('printer-edit-btn') !== -1) {
        const printerId = event.target.id.toString().split('_');
        editPrinter(printerId[1]);
      }

      // if printer delete click
      else if (event.target.id.search('printer-delete-btn') !== -1) {
        const printerId = event.target.id.toString().split('_');
        deletePrinter(printerId[1]);
      }

      // if media edit click
      else if (event.target.id.search('media-edit-btn') !== -1) {
        const mediaId = event.target.id.toString().split('_');
        editMedia(mediaId[1]);
      }

      // if media delete click
      else if (event.target.id.search('media-delete-btn') !== -1) {
        const mediaId = event.target.id.toString().split('_');
        deleteMedia(mediaId[1]);
      }

      // if flat charge edit click
      else if (event.target.id.search('flatCharge-edit-btn') !== -1) {
        const flatChargeId = event.target.id.toString().split('_');
        editFlatCharge(flatChargeId[1]);
      }

      // if flat charge delete click
      else if (event.target.id.search('flatCharge-delete-btn') !== -1) {
        const flatChargeId = event.target.id.toString().split('_');
        deleteFlatCharge(flatChargeId[1]);
      }

      // if turnaround edit click
      else if (event.target.id.search('turnaround-edit-btn') !== -1) {
        const turnaroundId = event.target.id.toString().split('_');
        editTurnaround(turnaroundId[1]);
      }

      // if turnaround delete click
      else if (event.target.id.search('turnaround-delete-btn') !== -1) {
        const turnaroundId = event.target.id.toString().split('_');
        deleteTurnaround(turnaroundId[1]);
      }

      // if finishing edit click
      else if (event.target.id.search('finishing-edit-btn') !== -1) {
        const finishingId = event.target.id.toString().split('_');
        editFinishing(finishingId[1]);
      }

      // if finishing delete click
      else if (event.target.id.search('finishing-delete-btn') !== -1) {
        const finishingId = event.target.id.toString().split('_');
        deleteFinishing(finishingId[1]);
      }

      // if artwork options edit click
      else if (event.target.id.search('artworkOption-edit-btn') !== -1) {
        const artworkOptionId = event.target.id.toString().split('_');
        editArtworkOption(artworkOptionId[1]);
      }

      // if artwork options delete click
      else if (event.target.id.search('artworkOption-delete-btn') !== -1) {
        const artworkOptionId = event.target.id.toString().split('_');
        deleteArtworkOption(artworkOptionId[1]);
      }

      // if size edit click
      else if (event.target.id.search('size-edit-btn') !== -1) {
        const sizeId = event.target.id.toString().split('_');
        editSize(sizeId[1]);
      }

      // if size delete click
      else if (event.target.id.search('size-delete-btn') !== -1) {
        const sizeId = event.target.id.toString().split('_');
        deleteSize(sizeId[1]);
      }

      // for category form submits
      else if (event.target.id === 'categorySubmit') {
        $('#categorySubmit').attr('disabled', 'disabled');
        handleCategoryFormSubmit();
      }

      // for printer form submits
      else if (event.target.id === 'printerSubmit') {
        $('#printerSubmit').attr('disabled', 'disabled');
        handlePrinterFormSubmit();
      }

      // for media form submits
      else if (event.target.id === 'mediaSubmit') {
        $('#mediaSubmit').attr('disabled', 'disabled');
        handleMediaFormSubmit();
      }

      // for flat charge form submits
      else if (event.target.id === 'flatChargeSubmit') {
        $('#flatChargeSubmit').attr('disabled', 'disabled');
        handleFlatChargeFormSubmit();
      }

      // for turnaround form submits
      else if (event.target.id === 'turnaroundSubmit') {
        $('#turnaroundSubmit').attr('disabled', 'disabled');
        handleTurnaroundFormSubmit();
      }

      // for finishing form submits
      else if (event.target.id === 'finishingSubmit') {
        $('#finishingSubmit').attr('disabled', 'disabled');
        handleFinishingFormSubmit();
      }

      // for artwork options form submits
      else if (event.target.id === 'artworkOptionSubmit') {
        $('#artworkOptionSubmit').attr('disabled', 'disabled');
        handleArtworkOptionFormSubmit();
      }

      // for size form submits
      else if (event.target.id === 'sizeSubmit') {
        $('#sizeSubmit').attr('disabled', 'disabled');
        handleSizeFormSubmit();
      }

    }

  });

}

// makes all calls to admin service
function callAdminService (data) {

  const settings = {
    url: 'https://services.bannerstack.com/admin.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

$(initAdmin)
