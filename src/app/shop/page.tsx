import Shop from "@/components/pages/shops/shop";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Shop MagnetHub",
};
const page = () => {
  return (
    <Wrapper>
      <Shop />
    </Wrapper>
  )
}

export default page