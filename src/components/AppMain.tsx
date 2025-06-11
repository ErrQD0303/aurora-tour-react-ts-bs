import { useMemo, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import BookingModal from "./BookingModal";
import PageOverview from "./PageOverview";

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
