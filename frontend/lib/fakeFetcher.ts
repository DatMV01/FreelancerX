// lib/fakeFetcher.ts
export const fakeFetcher = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Order #1", status: "pending" },
        { id: 2, name: "Order #2", status: "completed" },
      ]);
    }, 2000);
  });
};

export const fakekFavoriteGigs = async () => {
  return new Promise((resolve) => {
    const mockFavoriteGigs = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Gig số ${i + 1} - Thiết kế chuyên nghiệp`,
      freelancer: `Freelancer ${i + 1}`,
      price: Math.floor(Math.random() * 1000000) + 200000, // 200k - 1.2tr
      rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 - 5.0
      image: `https://source.unsplash.com/random/400x300?sig=${i + 1}&creative`,
    }));

    setTimeout(() => {
      resolve(mockFavoriteGigs);
    }, 2000);
  });
};
