const Error404 = {
  render: async () => {
    let view = `
        <section>Error 404 not found</section>
      `;
    return view;
  },
  afterRender: async () => {}
};
export default Error404;
