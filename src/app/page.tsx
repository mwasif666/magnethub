import HomeOne from "@/components/homes/home-one";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Magnet Hub",
};
const page = () => {
  return (
    <Wrapper>
      <HomeOne />
    </Wrapper>
  );
};

export default page;
