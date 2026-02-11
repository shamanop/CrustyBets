import Matter from 'matter-js';

export interface ClawMachineConfig {
  width: number;
  height: number;
  prizeCount: number;
}

export interface Prize {
  body: Matter.Body;
  spriteKey: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
}

const RARITY_WEIGHTS: Record<string, number> = {
  common: 10,
  uncommon: 6,
  rare: 3,
  epic: 1,
  legendary: 0.5,
};

const PRIZE_TEMPLATES = [
  { name: 'Rubber Crab', rarity: 'common' as const, value: 5, spriteKey: 'prize-crab' },
  { name: 'Plastic Lobster', rarity: 'common' as const, value: 5, spriteKey: 'prize-lobster' },
  { name: 'Shell Keychain', rarity: 'common' as const, value: 8, spriteKey: 'prize-shell' },
  { name: 'Mini Anchor', rarity: 'common' as const, value: 8, spriteKey: 'prize-anchor' },
  { name: 'Seaweed Plush', rarity: 'uncommon' as const, value: 15, spriteKey: 'prize-seaweed' },
  { name: 'Pearl Necklace', rarity: 'uncommon' as const, value: 20, spriteKey: 'prize-pearl' },
  { name: 'Coral Crown', rarity: 'uncommon' as const, value: 25, spriteKey: 'prize-coral' },
  { name: 'Treasure Map', rarity: 'rare' as const, value: 50, spriteKey: 'prize-map' },
  { name: 'Golden Shell', rarity: 'rare' as const, value: 60, spriteKey: 'prize-gold-shell' },
  { name: 'Crystal Crab', rarity: 'rare' as const, value: 75, spriteKey: 'prize-crystal' },
  { name: 'Neptune\'s Trident', rarity: 'epic' as const, value: 150, spriteKey: 'prize-trident' },
  { name: 'King Crab Crown', rarity: 'epic' as const, value: 200, spriteKey: 'prize-crown' },
  { name: 'Golden Lobster', rarity: 'legendary' as const, value: 500, spriteKey: 'prize-golden' },
];

export class ClawPhysicsEngine {
  engine: Matter.Engine;
  world: Matter.World;
  runner: Matter.Runner | null = null;

  // Machine boundaries
  walls: Matter.Body[] = [];
  floor: Matter.Body;

  // Claw components
  clawBase: Matter.Body;
  leftJaw: Matter.Body;
  rightJaw: Matter.Body;
  cable: Matter.Constraint;
  leftHinge: Matter.Constraint;
  rightHinge: Matter.Constraint;

  // State
  prizes: Prize[] = [];
  dropChute: Matter.Body;
  isGrabbing = false;
  isDropping = false;
  clawOpen = true;

  config: ClawMachineConfig;

  constructor(config: ClawMachineConfig) {
    this.config = config;
    const { width, height } = config;

    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.5, scale: 0.001 },
    });
    this.world = this.engine.world;

    // Walls
    const wallThickness = 20;
    const leftWall = Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, label: 'wall-left' });
    const rightWall = Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, label: 'wall-right' });
    const topWall = Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, label: 'wall-top' });
    this.floor = Matter.Bodies.rectangle(width / 2, height - 20, width, 40, { isStatic: true, label: 'floor' });

    this.walls = [leftWall, rightWall, topWall, this.floor];

    // Drop chute (sensor at bottom-right)
    this.dropChute = Matter.Bodies.rectangle(width - 40, height - 60, 60, 80, {
      isStatic: true,
      isSensor: true,
      label: 'drop-chute',
    });

    // Claw assembly
    const clawStartX = width / 2;
    const clawStartY = 60;

    this.clawBase = Matter.Bodies.rectangle(clawStartX, clawStartY, 40, 20, {
      label: 'claw-base',
      density: 0.01,
      frictionAir: 0.05,
    });

    this.leftJaw = Matter.Bodies.trapezoid(clawStartX - 20, clawStartY + 30, 15, 35, 0.3, {
      label: 'claw-left-jaw',
      density: 0.005,
      friction: 0.8,
    });

    this.rightJaw = Matter.Bodies.trapezoid(clawStartX + 20, clawStartY + 30, 15, 35, 0.3, {
      label: 'claw-right-jaw',
      density: 0.005,
      friction: 0.8,
    });

    // Cable: anchor point to claw base
    this.cable = Matter.Constraint.create({
      pointA: { x: clawStartX, y: 10 },
      bodyB: this.clawBase,
      pointB: { x: 0, y: 0 },
      stiffness: 0.9,
      damping: 0.1,
      length: 50,
      label: 'cable',
    });

    // Jaw hinges
    this.leftHinge = Matter.Constraint.create({
      bodyA: this.clawBase,
      pointA: { x: -15, y: 10 },
      bodyB: this.leftJaw,
      pointB: { x: 5, y: -15 },
      stiffness: 0.7,
      damping: 0.1,
      length: 0,
      label: 'left-hinge',
    });

    this.rightHinge = Matter.Constraint.create({
      bodyA: this.clawBase,
      pointA: { x: 15, y: 10 },
      bodyB: this.rightJaw,
      pointB: { x: -5, y: -15 },
      stiffness: 0.7,
      damping: 0.1,
      length: 0,
      label: 'right-hinge',
    });

    // Add everything to world
    Matter.Composite.add(this.world, [
      ...this.walls,
      this.dropChute,
      this.clawBase,
      this.leftJaw,
      this.rightJaw,
      this.cable,
      this.leftHinge,
      this.rightHinge,
    ]);

    // Generate prizes
    this.generatePrizes(config.prizeCount);

    // Collision detection for drop chute
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        if (pair.bodyA.label === 'drop-chute' || pair.bodyB.label === 'drop-chute') {
          const prizeBody = pair.bodyA.label === 'drop-chute' ? pair.bodyB : pair.bodyA;
          const prize = this.prizes.find(p => p.body.id === prizeBody.id);
          if (prize) {
            this.onPrizeWon?.(prize);
          }
        }
      }
    });
  }

  onPrizeWon?: (prize: Prize) => void;

  generatePrizes(count: number) {
    const { width, height } = this.config;

    for (let i = 0; i < count; i++) {
      const template = this.selectWeightedPrize();
      const x = 60 + Math.random() * (width - 120);
      const y = height - 80 - Math.random() * 150;
      const size = 20 + Math.random() * 15;

      const body = Matter.Bodies.circle(x, y, size, {
        label: `prize-${i}`,
        restitution: 0.3,
        friction: 0.5,
        density: 0.002 + (template.rarity === 'legendary' ? 0.003 : 0),
      });

      this.prizes.push({
        body,
        spriteKey: template.spriteKey,
        name: template.name,
        rarity: template.rarity,
        value: template.value,
      });

      Matter.Composite.add(this.world, body);
    }
  }

  selectWeightedPrize() {
    const totalWeight = PRIZE_TEMPLATES.reduce((sum, t) => sum + (RARITY_WEIGHTS[t.rarity] || 1), 0);
    let random = Math.random() * totalWeight;

    for (const template of PRIZE_TEMPLATES) {
      random -= RARITY_WEIGHTS[template.rarity] || 1;
      if (random <= 0) return template;
    }
    return PRIZE_TEMPLATES[0];
  }

  moveClaw(direction: 'left' | 'right' | 'up' | 'down', force: number = 0.003) {
    const forces: Record<string, { x: number; y: number }> = {
      left: { x: -force, y: 0 },
      right: { x: force, y: 0 },
      up: { x: 0, y: -force },
      down: { x: 0, y: force },
    };
    Matter.Body.applyForce(this.clawBase, this.clawBase.position, forces[direction]);
  }

  dropClaw() {
    if (this.isDropping) return;
    this.isDropping = true;

    // Extend cable length to drop
    const targetLength = this.config.height - 120;
    const step = () => {
      if (this.cable.length < targetLength) {
        this.cable.length += 3;
        requestAnimationFrame(step);
      } else {
        // Auto-grab after reaching bottom
        setTimeout(() => this.grab(), 300);
      }
    };
    step();
  }

  grab() {
    this.isGrabbing = true;
    this.clawOpen = false;

    // Close jaws by adjusting hinge constraints
    this.leftHinge.length = 0;
    this.rightHinge.length = 0;

    // Move jaws inward
    Matter.Body.applyForce(this.leftJaw, this.leftJaw.position, { x: 0.002, y: 0 });
    Matter.Body.applyForce(this.rightJaw, this.rightJaw.position, { x: -0.002, y: 0 });

    // Retract cable after grabbing
    setTimeout(() => this.retract(), 500);
  }

  retract() {
    const minLength = 50;
    const step = () => {
      if (this.cable.length > minLength) {
        this.cable.length -= 2;
        requestAnimationFrame(step);
      } else {
        this.isDropping = false;
        // Release after reaching top
        setTimeout(() => this.release(), 1000);
      }
    };
    step();
  }

  release() {
    this.isGrabbing = false;
    this.clawOpen = true;

    // Open jaws
    Matter.Body.applyForce(this.leftJaw, this.leftJaw.position, { x: -0.001, y: 0 });
    Matter.Body.applyForce(this.rightJaw, this.rightJaw.position, { x: 0.001, y: 0 });
  }

  start() {
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
  }

  stop() {
    if (this.runner) {
      Matter.Runner.stop(this.runner);
    }
  }

  getClawPosition() {
    return {
      x: this.clawBase.position.x,
      y: this.clawBase.position.y,
    };
  }

  getPrizePositions() {
    return this.prizes.map(p => ({
      x: p.body.position.x,
      y: p.body.position.y,
      angle: p.body.angle,
      name: p.name,
      rarity: p.rarity,
      spriteKey: p.spriteKey,
    }));
  }

  destroy() {
    this.stop();
    Matter.Engine.clear(this.engine);
    Matter.Composite.clear(this.world, false);
  }
}
