import knex from "knexClient";
import getAvailabilities from "./getAvailabilities";

describe("getAvailabilities", () => {
  beforeEach(() => knex("events").truncate());

  describe("case 1", () => {
    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(10);
      for (let i = 0; i < 7; ++i) {
        expect(availabilities[i].slots).toEqual([]);
      }
    });
  });

  describe("case 2", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(10);

      expect(String(availabilities[0].date)).toBe(
          String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
          String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
          String(new Date("2014-08-16"))
      );
    });
  });

  describe("case 3", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2018-08-04 09:30"),
          ends_at: new Date("2018-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(10);

      expect(String(availabilities[0].date)).toBe(
          String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
          String(new Date("2014-08-11"))
      );
      expect(availabilities[6].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);
    });
  });


  describe("case 4", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2020-02-11 10:30"),
          ends_at: new Date("2020-02-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2020-02-09 09:30"),
          ends_at: new Date("2020-02-09 12:30"),
          weekly_recurring: true
        },
        {
          kind: "appointment",
          starts_at: new Date("2020-03-07 10:30"),
          ends_at: new Date("2020-03-07 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2020-03-22 09:30"),
          ends_at: new Date("2020-03-22 12:30"),
          weekly_recurring: false
        },
        {
          kind: "appointment",
          starts_at: new Date("2020-04-07 10:30"),
          ends_at: new Date("2020-04-08 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2020-04-11 09:30"),
          ends_at: new Date("2020-04-11 12:30"),
          weekly_recurring: false
        }
      ]);
    });

    it("availability after 7 days", async () => {
      const availabilities = await getAvailabilities(new Date("2020-02-16"), 25);

      expect(availabilities.length).toBe(25);

      expect(String(availabilities[0].date)).toBe(
          String(new Date("2020-02-16"))
      );
      expect(String(availabilities[14].date)).toBe(
          String(new Date("2020-03-01"))
      );

      expect(availabilities[14].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);
    });
  });

});
