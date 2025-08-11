export const shareEmailTemplate = (
  title: string,
  text: string,
  image: string
) => {
  return `
    <div style="background-color: #f3f7fc; padding: 20px; border-radius: 10px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
        <div style="display: flex; align-items: center;">
          <img src="${image}" alt="image" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;" />
          <div style="font-size: 16px; font-weight: bold;">${title}</div>
        </div>
        <div style="font-size: 14px; color: #999; margin-top: 5px;">${text}</div>
      </div>
    </div>
  `;
};
