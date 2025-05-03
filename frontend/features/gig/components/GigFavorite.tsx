import { GigDto } from "@/dto/dto.type.";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import {
  selectFavoriteGigs,
  addFavoriteGig,
  removeFavoriteGig,
  selectFavoriteGigsStatus,
} from "@/lib/redux/features/gigs/gigsSlice2";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Tooltip } from "@mui/material";
import { Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addFavoriteGig as addFavoriteGigAPI,
  removeFavoriteGig as removeFavoriteGigAPI,
} from "../gig.api";

const GigFavorite = ({ gig }: { gig: GigDto }) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const isGigOwner = gig?.freelancer?.email === user?.email;

  const [isLoading, setLoading] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const favoriteGigs = useAppSelector(selectFavoriteGigs);
  const favoriteGigsStatus = useAppSelector(selectFavoriteGigsStatus);

  const handleAddFavoriteGig = async () => {
    // if (isGigOwner) {
    //   toast.info("Preview mode");
    //   return;
    // }

    try {
      setLoading(true);
      await addFavoriteGigAPI(gig.id);
      dispatch(addFavoriteGig(gig));
      setLoading(false);
    } catch (error) {
      console.error("Add failed", error);
    }
  };

  const handleRemoveFavoriteGig = async () => {
    // if (isGigOwner) {
    //   toast.info("Preview mode");
    //   return;
    // }

    try {
      setLoading(true);
      await removeFavoriteGigAPI(gig.id);
      dispatch(removeFavoriteGig(gig));
      setLoading(false);
    } catch (error) {
      console.error("Add failed", error);
    }
  };

  useEffect(() => {
    const isFavorite = favoriteGigs.some((gigItem) => gigItem.id === gig.id);

    setFavorite(isFavorite);
  }, [favoriteGigs]);

  const loading = isLoading || favoriteGigsStatus;
  return (
    <>
      {loading && <Loader2 className="animate-spin" size={18} />}

      {!loading && isFavorite && (
        <Tooltip title="Remove" placement="top">
          <button
            className="flex items-center justify-center rounded-full bg-transparent"
            onClick={handleRemoveFavoriteGig}
          >
            <Heart className="fill-red-500 stroke-none" />
          </button>
        </Tooltip>
      )}

      {!loading && !isFavorite && (
        <Tooltip title="Save to list" placement="top">
          <button
            className="flex items-center justify-center rounded-full bg-transparent"
            onClick={handleAddFavoriteGig}
          >
            <Heart className="fill-[#d4dbf8] stroke-none" />
          </button>
        </Tooltip>
      )}
    </>
  );
};

export default GigFavorite;
