localhost:3000/api/v1/stripe/webhook


netstat -ano | findstr :3000
taskkill /PID <PID> /F


4242 4242 4242 4242
4000 0000 0000 0002	Bị từ chối	Thẻ không được chấp nhận
4000 0000 0000 9995	Không đủ tiền	Payment bị từ chối vì tài khoản không đủ
4000 0000 0000 0127	Hết hạn	Stripe từ chối vì thẻ expired
4000 0000 0000 0341	CVC sai	Xác thực thất bại vì CVC không đúng
4000 0000 0000 0119	Thẻ bị nghi ngờ fraud	Stripe từ chối vì nghi ngờ gian lận


Sử dụng giống như thẻ thành công:

MM/YY: bất kỳ hợp lệ (VD: 12/34)

CVC: 3 số bất kỳ (VD: 123)

ZIP: 5 số bất kỳ (VD: 10000)
