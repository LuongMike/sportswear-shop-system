import HeroBanner from "@/components/home/HeroBanner";
import FavoriteBrands from "@/components/home/FavoriteBrands";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import Container from "@/components/ui/Container";

const HomePage = () => {
  return (
    <div>
      <HeroBanner />
      <Container>
        <FavoriteBrands />
        <ProductsByBrand />
      </Container>
    </div>
  );
};

export default HomePage;
