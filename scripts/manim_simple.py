"""
Simple Manim Scene (No LaTeX required)
기본 도형 애니메이션
"""
from manim import *

class SimpleAnimation(Scene):
    def construct(self):
        # 제목 (Text는 LaTeX 불필요)
        title = Text("Manim + Remotion", font_size=56, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title), run_time=1)

        # 원, 사각형, 삼각형 생성
        circle = Circle(radius=1.5, color=BLUE, fill_opacity=0.5)
        square = Square(side_length=2.5, color=GREEN, fill_opacity=0.5)
        triangle = Triangle(color=RED, fill_opacity=0.5).scale(1.5)

        # 위치 설정
        circle.shift(LEFT * 3)
        triangle.shift(RIGHT * 3)

        # 도형 등장
        self.play(
            Create(circle),
            Create(square),
            Create(triangle),
            run_time=1.5
        )
        self.wait(0.5)

        # 도형 변환 (원 -> 사각형 -> 삼각형)
        self.play(Transform(circle, square.copy().shift(LEFT * 3)), run_time=1)
        self.play(Transform(square, triangle.copy().move_to(ORIGIN)), run_time=1)
        self.play(Transform(triangle, circle.copy().shift(RIGHT * 3)), run_time=1)

        self.wait(0.5)

        # 회전 애니메이션
        self.play(
            Rotate(circle, angle=2*PI),
            Rotate(square, angle=2*PI),
            Rotate(triangle, angle=2*PI),
            run_time=2
        )

        # 페이드 아웃
        self.play(
            FadeOut(circle),
            FadeOut(square),
            FadeOut(triangle),
            run_time=1
        )

        # 마무리 텍스트
        outro = Text("MCP Pipeline Demo", font_size=48, color=YELLOW)
        self.play(Write(outro), run_time=1)
        self.wait(1)


class GeometryShowcase(Scene):
    def construct(self):
        # 배경 그라디언트 효과 (사각형으로)
        bg = Rectangle(
            width=16, height=9,
            fill_color=[BLUE_E, PURPLE_E],
            fill_opacity=0.3,
            stroke_width=0
        )
        self.add(bg)

        # 타이틀
        title = Text("Geometry Showcase", font_size=48, color=WHITE)
        title.to_edge(UP, buff=0.5)
        self.play(FadeIn(title, shift=DOWN), run_time=0.8)

        # 도형 배열
        shapes = VGroup()
        colors = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE]

        for i, color in enumerate(colors):
            if i % 3 == 0:
                shape = Circle(radius=0.6, color=color, fill_opacity=0.7)
            elif i % 3 == 1:
                shape = Square(side_length=1, color=color, fill_opacity=0.7)
            else:
                shape = Triangle(color=color, fill_opacity=0.7).scale(0.7)
            shapes.add(shape)

        shapes.arrange(RIGHT, buff=0.5)
        shapes.move_to(ORIGIN)

        # 순차적 등장
        for shape in shapes:
            self.play(GrowFromCenter(shape), run_time=0.3)

        self.wait(0.5)

        # 원형 배열로 변환
        self.play(
            shapes.animate.arrange_in_grid(rows=2, cols=3, buff=0.8),
            run_time=1
        )
        self.wait(0.5)

        # 회전
        self.play(Rotate(shapes, angle=PI/2), run_time=1)

        # 스케일 펄스
        self.play(
            shapes.animate.scale(1.3),
            run_time=0.5
        )
        self.play(
            shapes.animate.scale(1/1.3),
            run_time=0.5
        )

        # 페이드 아웃
        self.play(FadeOut(shapes), FadeOut(title), run_time=1)

        # 아웃트로
        outro = VGroup(
            Text("Created with", font_size=32, color=WHITE),
            Text("Manim + Excalidraw + Remotion", font_size=40, color=YELLOW)
        ).arrange(DOWN, buff=0.3)

        self.play(FadeIn(outro, scale=0.5), run_time=1)
        self.wait(1)
