import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ManageGigs() {
  const [gigs, setGigs] = useState([
    { id: 1, title: "Web Development", price: 100, status: "Active", views: 50, orders: 5, rating: 4.5 },
    { id: 2, title: "Graphic Design", price: 50, status: "Pending", views: 30, orders: 2, rating: 4.0 },
    { id: 3, title: "SEO Services", price: 80, status: "Active", views: 120, orders: 8, rating: 4.7 },
  ]);

  // Tính toán các số liệu thống kê
  const totalRevenue = gigs.reduce((total, gig) => total + gig.price * gig.orders, 0);
  const totalOrders = gigs.reduce((total, gig) => total + gig.orders, 0);
  const totalViews = gigs.reduce((total, gig) => total + gig.views, 0);
  const activeGigs = gigs.filter(gig => gig.status === "Active").length;
  const pendingGigs = gigs.filter(gig => gig.status === "Pending").length;
  const pausedGigs = gigs.filter(gig => gig.status === "Paused").length;

  const [newGigTitle, setNewGigTitle] = useState("");
  const [newGigPrice, setNewGigPrice] = useState("");
  const [newGigStatus, setNewGigStatus] = useState("Active");

  const handleCreateGig = () => {
    const newGig = {
      id: gigs.length + 1,
      title: newGigTitle,
      price: parseFloat(newGigPrice),
      status: newGigStatus,
      views: 0,
      orders: 0,
      rating: 0,
    };
    setGigs([...gigs, newGig]);
    setNewGigTitle("");
    setNewGigPrice("");
  };

  const handleDeleteGig = (id) => {
    setGigs(gigs.filter(gig => gig.id !== id));
  };

  const handleEditGig = (id) => {
    // Logic to edit gig (could open a dialog or navigate to a form page)
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-xl border bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">📝 Quản lý Gigs</h2>
        
        {/* Thống kê Gigs */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Tổng Doanh Thu</h3>
            <p className="text-xl font-bold">${totalRevenue}</p>
          </div>
          <div className="p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Tổng Số Đơn</h3>
            <p className="text-xl font-bold">{totalOrders}</p>
          </div>
          <div className="p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Tổng Số Lượt Xem</h3>
            <p className="text-xl font-bold">{totalViews}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Gig Hoạt Động</h3>
            <p className="text-xl font-bold">{activeGigs}</p>
          </div>
          <div className="p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Gig Chờ Duyệt</h3>
            <p className="text-xl font-bold">{pendingGigs}</p>
          </div>
          <div className="p-4 border rounded bg-gray-100">
            <h3 className="font-semibold">Gig Tạm Dừng</h3>
            <p className="text-xl font-bold">{pausedGigs}</p>
          </div>
        </div>

        {/* Tìm kiếm và Tạo mới Gig */}
        <div className="flex justify-between mb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên gig"
            className="w-1/3"
          />
          <Button className="w-fit">Tạo mới Gig</Button>
        </div>

        {/* Danh sách Gig */}
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Tên Gig</th>
              <th className="border px-4 py-2">Giá</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Số lượt xem</th>
              <th className="border px-4 py-2">Số đơn</th>
              <th className="border px-4 py-2">Đánh giá</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {gigs.map((gig) => (
              <tr key={gig.id}>
                <td className="border px-4 py-2">{gig.title}</td>
                <td className="border px-4 py-2">${gig.price}</td>
                <td className="border px-4 py-2">{gig.status}</td>
                <td className="border px-4 py-2">{gig.views}</td>
                <td className="border px-4 py-2">{gig.orders}</td>
                <td className="border px-4 py-2">{gig.rating}</td>
                <td className="border px-4 py-2">
                  <Button onClick={() => handleEditGig(gig.id)} className="mr-2">Chỉnh sửa</Button>
                  <Button onClick={() => handleDeleteGig(gig.id)} variant="danger">Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tạo mới Gig */}
      <div className="p-6 rounded-xl border bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">📦 Tạo mới Gig</h2>
        <div className="space-y-4">
          <div>
            <Label>Tên Gig</Label>
            <Input
              type="text"
              value={newGigTitle}
              onChange={(e) => setNewGigTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Giá</Label>
            <Input
              type="number"
              value={newGigPrice}
              onChange={(e) => setNewGigPrice(e.target.value)}
            />
          </div>
          <div>
            <Label>Trạng thái</Label>
            <select
              value={newGigStatus}
              onChange={(e) => setNewGigStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Hoạt động</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Paused">Tạm dừng</option>
            </select>
          </div>
          <Button onClick={handleCreateGig} className="mt-4">
            Tạo Gig mới
          </Button>
        </div>
      </div>
    </div>
  );
}
