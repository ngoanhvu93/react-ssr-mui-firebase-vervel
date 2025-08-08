import Chip from "@mui/material/Chip";

const Today = (props: { vietnameseDate: string; currentDate: string }) => {
  return (
    <div className="flex items-center gap-2 w-full justify-between">
      <Chip label="Hôm nay" size="small" />
      <Chip label={props.vietnameseDate} size="small" />
      <Chip label={props.currentDate} size="small" />
    </div>
  );
};

export default Today;
