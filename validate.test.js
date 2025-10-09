const validator = require("./helpers/validate");

test("validator passes with valid data and rules", (done) => {
  const body = { email: "a@b.com", password: "secret" };
  const rules = { email: "required|string", password: "required|string" };
  validator(body, rules, {}, (err, status) => {
    expect(status).toBe(true);
    expect(err).toBeNull();
    done();
  });
});

test("validator fails when required fields are missing", (done) => {
  const body = { email: "" };
  const rules = { email: "required|string", password: "required|string" };
  validator(body, rules, {}, (err, status) => {
    expect(status).toBe(false);
    // validatorjs returns an object with messages
    expect(err).toBeTruthy();
    expect(err.errors).toBeDefined();
    done();
  });
});
