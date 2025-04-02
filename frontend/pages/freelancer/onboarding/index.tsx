
import { Counter } from "@/components/counter/Counter";
import { selectAccessToken } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";

const SellerOnBoarding = () => {
  const accessToken = useAppSelector(selectAccessToken);

  return (
    <div>
      SellerOnBoarding
      <div className="text-wrap">{accessToken}</div>
      <Counter />
    </div>
  );
};

export default SellerOnBoarding;
