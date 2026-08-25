import { DraftResult } from "./types";

export const SAMPLE_DISCLOSURE = `The invention comprises a multi-layered neural network architecture designed for edge computing devices. 

It utilizes a novel quantization module that dynamically adjusts weight precision based on real-time thermal sensor data from the processor, reducing power consumption during peak load while maintaining accuracy.

The system includes a primary processing unit, a thermal sensor array, and a dynamic weight quantization controller.`;

export const MOCK_DRAFT_RESULT: DraftResult = {
  confidenceScore: 94,
  claims: [
    {
      number: 1,
      type: "independent",
      text: "A computing system for dynamic power management, comprising:",
      subClauses: [
        {
          title: "a primary processing unit",
          text: "configured to execute a neural network model;",
        },
        {
          title: "a thermal sensor array",
          text: "communicatively coupled to the primary processing unit, configured to generate real-time thermal data; and",
        },
        {
          title: "a dynamic weight quantization controller",
          text: "configured to:",
          nestedItems: [
            "receive the real-time thermal data; and",
            "adjust a precision level of weights in the neural network model based on the real-time thermal data.",
          ],
        },
      ],
    },
    {
      number: 2,
      type: "dependent",
      parentClaimNumber: 1,
      text: "The computing system of claim 1, wherein the dynamic weight quantization controller reduces the precision level of the weights when the real-time thermal data indicates a temperature exceeding a predetermined threshold.",
    },
    {
      number: 3,
      type: "dependent",
      parentClaimNumber: 1,
      text: "The computing system of claim 1, wherein adjusting the precision level comprises transitioning from a 32-bit floating-point representation to an 8-bit integer representation.",
    },
    {
      number: 4,
      type: "independent",
      text: "A method for managing power in a neural network processor, the method comprising:",
      subClauses: [
        {
          text: "monitoring a temperature of the processor during execution of a neural network;",
        },
        {
          text: "comparing the monitored temperature to a set of thermal profiles;",
        },
        {
          text: "dynamically quantizing synaptic weights of the neural network in response to the comparison to reduce computational load.",
        },
      ],
    },
  ],
};
