import React from 'react';
import { Route, Routes } from "react-router-dom";
import Profile from '../../pages/Profile';
import Login from '../../pages/Login';
import AdminPanel from '../../pages/Admin/pages/Admin-ponel/index'; // Ваш существующий компонент админ-панели
import Statistics from '../../pages/Admin/pages/Admin-ponel/pages/Statistics'; // Страница статистики
import Users from '../../pages/Admin/pages/Admin-ponel/pages/users'; // Страница пользователей

// Импортируем Warehouse и его страницы
import Warehouse from '../../pages/Warehouse';
import Products from '../../pages/Warehouse/pages/Products';
import SendProductsToShopView from '../../pages/Warehouse/pages/SendProductsToShowcase';
import RemoveProductsFromShowcase from '../../pages/Warehouse/pages/RemoveProductsFromShowcase';
import TransferProductsToWarehouse from '../../pages/Warehouse/pages/TransferProductsToWarehouse';
import OrderProducts from '../../pages/Warehouse/pages/OrderProducts';
import Shop from '../../pages/Warehouse/pages/Shop';

export default function RouterConfig() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ADMIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Route path="/admin" element={<Profile />} />   
      <Route path="/admin">
        <Route path="admin-panel" element={<AdminPanel />}>
          <Route path="statistics" element={<Statistics />} /> {/* /admin/admin-panel/statistics */}
          <Route path="users" element={<Users />} /> {/* /admin/admin-panel/users */}
        </Route>
      </Route>




      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~WAREHOUSE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Route path="/warehouse" element={<Profile />} />
      <Route path="/warehouse">
        <Route path="products" element={<Products />} /> {/* /warehouse/products */}
        <Route path="send-to-showcase" element={<SendProductsToShopView />} /> {/* /warehouse/send-to-showcase */}
        <Route path="remove-from-showcase" element={<RemoveProductsFromShowcase />} /> {/* /warehouse/remove-from-showcase */}
        <Route path="transfer-to-warehouse" element={<TransferProductsToWarehouse />} /> {/* /warehouse/transfer-to-warehouse */}
        <Route path="order-products" element={<OrderProducts />} /> {/* /warehouse/order-products */}
        <Route path="shop" element={<Shop />} /> {/* /warehouse/shop */}
      </Route>



      {/* <Route path="/*" element={<Error />} /> */}
    </Routes>
  );
}