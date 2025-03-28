import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import useUserStore from "@/store/useUser";
import Loading from "@/components/Loading/Loading";

const Profile = lazy(() => import("@/pages/Profile"));
const Login = lazy(() => import("@/pages/Login"));
const Error404 = lazy(() => import("@/pages/Error404"));
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Admin~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Admin = lazy(() => import("@/pages/Admin"));
const AdminAdminPanel = lazy(() => import("@/pages/Admin/pages/Admin-ponel"));
const AdminStorege = lazy(() => import("@/pages/Admin/pages/Admin-ponel/pages/storege"));
const AdminShop = lazy(() => import("@/pages/Admin/pages/Admin-ponel/pages/shop"));
const AdminProduct = lazy(() => import("@/pages/Admin/pages/Admin-ponel/pages/product"));
const AdminUsers = lazy(() => import("@/pages/Admin/pages/Admin-ponel/pages/users"));
const AdminReport = lazy(() => import("@/pages/Admin/pages/Report"));
const AdminReportDetails = lazy(() => import("@/pages/Admin/pages/Report/components/ReportProductDetails"));
const AdminProductHistory = lazy(() => import("@/pages/Admin/pages/Admin-ponel/pages/product/components/productEditHistory/ProductHistory"));
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Warehouse~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Warehouse = lazy(() => import("@/pages/Warehouse"));
const WarehouseProducts = lazy(() => import("@/pages/Warehouse/pages/Product"));
const WarehouseSendProductsToShopView = lazy(() => import("@/pages/Warehouse/pages/SendProductsToShowcase"));
const WarehouseRemoveProductsFromShowcase = lazy(() => import("@/pages/Warehouse/pages/RemoveProductsFromShowcase"));
const WarehouseTransferProductsToWarehouse = lazy(() => import("@/pages/Warehouse/pages/TransferProductsToWarehouse"));
const WarehouseShop = lazy(() => import("@/pages/Warehouse/pages/Shop"));
const WarehouseShopReturnProduct = lazy(() => import("@/pages/Warehouse/pages/Shop/pages/ReturnProducts/ReturnProducts"));
const WarehouseCashregister = lazy (() => import("@/pages/Warehouse/pages/Cashregister")) ;
const WarehouseReportDetailes = lazy (() => import("@/pages/Warehouse/pages/ReportSellerSend/components/ReportDetailes")) ;
const WarehouseViewDetailesSingleShop = lazy (() => import("@/pages/Warehouse/pages/ReportSellerSend/components/ReportDetailesSingle")) ;
const WarehouseCashregisterDetails = lazy (() => import("@/pages/Warehouse/pages/Cashregister/components/CashregisterDetailes")) ;
const WarehouseReportWarehouseSend = lazy(() => import("@/pages/Warehouse/pages/ReportWarehouseSend"));
const WarehouseReportSellerSend = lazy(() => import("@/pages/Warehouse/pages/ReportSellerSend"));
const WarehouseViewDetaliesSendProducts = lazy (() => import("@/pages/Warehouse/pages/SendProductsToShowcase/components/ViewDetaliesSendProducts")) ;
const WarehouseViewDetaliesRemoveProducts = lazy (() => import("@/pages/Warehouse/pages/RemoveProductsFromShowcase/components/ViewDetaliesRemoveProducts")) ;
const WarehouseOrderProducts = lazy(() => import("@/pages/Warehouse/pages/OrderProducts"));
const WarehouseDetailProductsLists = lazy (() => import("./../../pages/Warehouse/pages/OrderProducts/components/DetialOrderProducts")) ;
const WarehouseViewDetaliesTransferProducts = lazy (() => import("@/pages/Warehouse/pages/TransferProductsToWarehouse/components/ViewDetaliesTransferProducts")) ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Seller~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Seller = lazy(() => import("@/pages/Seller"));
const SellerProduct = lazy(() => import("@/pages/Seller/pages/Product"));
const SellerWarehouse = lazy(() => import("@/pages/Seller/pages/Warehouse"));
const SellerReport = lazy(() => import("@/pages/Seller/pages/Report"));
const SellerReportDetails = lazy(() => import("@/pages/Seller/pages/Report/components/SingleReportShop")) ;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Director~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Director = lazy(() => import("@/pages/Director"));
const DirectorProduct = lazy(() => import("@/pages/Director/pages/Product"));
const DirectorSeller = lazy(() => import("@/pages/Director/pages/Seller"));
const DirectorReport = lazy(() => import("@/pages/Director/pages/Report"));
const ProductDetails = lazy(() => import("@/pages/Director/pages/Product/components/ProductDetalies")) ;
const DirectorReportDetailsSingle = lazy(() => import("@/pages/Director/pages/Report/components/ReportDetaliesSingle")) ;
const DirectorReportDetailsSellers = lazy(() => import("@/pages/Director/pages/Report/components/ReportDetaliesSellers")) ;
const getRoutesByRole = (role, isTrusted) => {
  if (!role) return null;
  switch (role) {
    case "admin":
      return (
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Profile />} />{" "}
          <Route path="admin-panel" element={<AdminAdminPanel />}>
            <Route path="storage" element={<AdminStorege />} />{" "}
            <Route path="shop" element={<AdminShop />} />{" "}
            <Route path="products" element={<AdminProduct />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="product-edit-history" element={<AdminProductHistory />}/>
          </Route>
          <Route path="report" element={<AdminReport />} />
          <Route path="report/:name" element={<AdminReportDetails />} />
        </Route>
      );
    case "staff":
      return (
        <Route path="/warehouse" element={<Warehouse />}>
          <Route index element={<Profile />} />
          <Route path="product-list" element={<WarehouseProducts />} />
          <Route path="send-to-showcase" element={<WarehouseSendProductsToShopView />}/>
          <Route path="send-to-showcase/:name" element={<WarehouseViewDetaliesSendProducts />}/>
          <Route path="remove-from-showcase" element={<WarehouseRemoveProductsFromShowcase />}/>
          <Route path="remove-from-showcase/:name" element={<WarehouseViewDetaliesRemoveProducts />}/>
          <Route path="transfer-to-warehouse" element={<WarehouseTransferProductsToWarehouse />}/>
          <Route path="transfer-to-warehouse/:name" element={<WarehouseViewDetaliesTransferProducts />}/>
            {
              isTrusted && (
                <>
                <Route path="order-products" element={<WarehouseOrderProducts />}/>
                <Route path="order-products/:name" element={<WarehouseDetailProductsLists />}/>
                </>
              )
            }
          <Route path="cash-register" element={<WarehouseCashregister />} />
          <Route path="cash-register/:name" element={<WarehouseCashregisterDetails />}/>
          <Route path="shop" element={<WarehouseShop />} />
          <Route path="report-warehouse-send" element={<WarehouseReportWarehouseSend />}/>
          <Route path="report-seller-send" element={<WarehouseReportSellerSend />}/>
          <Route path="report-seller-send/:name" element={<WarehouseReportDetailes />}/>
          <Route path="report-seller-send/:name/:date" element={<WarehouseViewDetailesSingleShop />}/>
          <Route path="shop" element={<WarehouseShop />} />
          <Route path="shop/:id" element={<WarehouseShopReturnProduct />} />
        </Route>
      );

    case "seller":
      return (
        <Route path="/seller" element={<Seller />}>
          <Route index element={<Profile />} />
          <Route path="product-list" element={<SellerProduct />} />
          <Route path="warehouse" element={<SellerWarehouse />} />
          <Route path="report" element={<SellerReport />} />
          <Route path="report/:date" element={<SellerReportDetails />}></Route>
        </Route>
      );

      case "user":
        return (
          <Route path="/seller" element={<Seller />}>
            <Route index element={<Profile />} />
            <Route path="product-list" element={<SellerProduct />} />
            <Route path="warehouse" element={<SellerWarehouse />} />
          </Route>
        );
  
    case "director":
      return (
        <Route path="/director" element={<Director />}>
          <Route index element={<Profile />} />
          <Route path="seller-list" element={<DirectorSeller />} />
          <Route path="product-list" element={<DirectorProduct />} />
          <Route path="product-list/:name" element={<ProductDetails />} />
          <Route path="report" element={<DirectorReport />} />
          <Route path="report/:name" element={<DirectorReportDetailsSellers />} />
          <Route path="report/:id/:name" element={<DirectorReportDetailsSingle />} />      
        </Route>
      );
  }
};

export default function RouterConfig() {
  const { user } = useUserStore();

  // if (!user) return <Loading />;

  return (
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route path="/" element={<Login />} />
        {getRoutesByRole(user?.role, user?.warehouse?.isTrusted)}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
}
