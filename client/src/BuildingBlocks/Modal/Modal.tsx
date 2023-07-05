import styles from "./Modal.module.scss";
const { modal, modalMain } = styles;

type propTypes = {
  handleClose: () => void;
  children: JSX.Element;
};

export const Modal = ({ handleClose, children }: propTypes) => {
  return (
    <div className={modal}>
      <section className={modalMain}>
        {children}
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
};
