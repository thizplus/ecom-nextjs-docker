import Link from "next/link";

import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type propsBack = {
  url: string;
}

const BtnBack = ({ url }: propsBack) => {
  return (

    <Link href={url} >
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<ArrowBackIcon />}
        color="secondary"
      >
        ย้อนกลับ
      </Button>
    </Link>

  )
}

export default BtnBack
