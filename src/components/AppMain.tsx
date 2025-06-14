import { useMemo, useState } from "react";
import HeroCarousel from "@components/HeroCarousel";
import BookingModal from "@components/BookingModal";
import PageOverview from "@components/PageOverview";
import Packages from "@components/Packages";
import FAQ from "@components/FAQ";

type AppMainProps = {
  showModal?: boolean | undefined;
  handleShowBookingModal?: () => void;
  handleCloseBookingModal?: () => void;
};

const AppMainUI = (props: AppMainProps) => {
  const { handleShowBookingModal, handleCloseBookingModal, showModal } = props;

  return (
    <main>
      <BookingModal
        as="section"
        id="booking-modal"
        show={showModal}
        onHide={handleCloseBookingModal}
      />
      <HeroCarousel
        as="section"
        id="hero-carousel"
        onBookingButtonClick={handleShowBookingModal}
      />
      <PageOverview id="page-overview" className="overview" />
      <Packages id="packages" onBookingButtonClick={handleShowBookingModal} />
      <FAQ id="faq" />
    </main>
  );
};

function AppMain() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [handleClose, handleShow] = useMemo(() => {
    const close = () => setShowModal(false);
    const show = () => setShowModal(true);
    return [close, show];
  }, []);

  return (
    <AppMainUI
      handleShowBookingModal={handleShow}
      handleCloseBookingModal={handleClose}
      showModal={showModal}
    />
  );
}

export default AppMain;
