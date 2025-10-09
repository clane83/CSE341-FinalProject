const { isAuthenticated } = require("./middleware/authentication");

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.jsonData = null;
  res.json = (data) => { res.jsonData = data; return res; };
  res.redirectedTo = null;
  res.redirect = (loc) => { res.redirectedTo = loc; return res; };
  res.get = (h) => res.headers[h.toLowerCase()] || "";
  return res;
}

test("OPTIONS requests bypass auth", () => {
  const req = { method: "OPTIONS", get: () => "" };
  const res = mockRes();
  const next = jest.fn();
  isAuthenticated(req, res, next);
  expect(next).toHaveBeenCalled();
});

test("Unauthed JSON request receives 401 JSON", () => {
  const req = {
    method: "GET",
    get: (h) => (h.toLowerCase() === "accept" ? "application/json" : ""),
    path: "/api/something"
  };
  const res = mockRes();
  const next = jest.fn();
  isAuthenticated(req, res, next);
  expect(res.statusCode).toBe(401);
  expect(res.jsonData).toBe("You do not have access.");
  expect(next).not.toHaveBeenCalled();
});

test("Unauthed browser navigation gets redirect to /login", () => {
  const req = {
    method: "GET",
    get: () => "text/html",
    path: "/web/page"
  };
  const res = mockRes();
  const next = jest.fn();
  isAuthenticated(req, res, next);
  expect(res.redirectedTo).toMatch(/^\/login\?error=auth_required/);
  expect(next).not.toHaveBeenCalled();
});

test("Authed user proceeds and req.user is set", () => {
  const req = {
    method: "GET",
    session: { user: { id: "abc123", name: "Test" } },
    get: () => "",
    path: "/"
  };
  const res = mockRes();
  const next = jest.fn();
  isAuthenticated(req, res, next);
  expect(req.user).toEqual({ id: "abc123", name: "Test" });
  expect(next).toHaveBeenCalled();
});
