import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
 
export function DisclaimerDialog() {
  const [open, setOpen] = React.useState(true);
 
  const handleOpen = () => setOpen(!open);
  const handleClose = () => window.location.href = `https://adulthub.fly.dev`;
 
  return (
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Anonymous Age Verification</DialogHeader>
        <DialogBody>
        All data collected is used only to verify age and the instantly deleted as you leave the site. This service is 100% anonymous for all visitors and contains no tracking data.
        </DialogBody>
        <DialogFooter>
        <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
  );
}